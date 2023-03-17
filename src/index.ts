import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { UserRouter } from "./routes/User_routes";
import { User } from "./entities/User";
import { Hall } from "./entities/Hall";
import { Booking } from "./entities/Booking";
import { LoginRouter } from "./routes/Login";
import { HallRouter } from "./routes/Hall_routes";
import { BookingRouter } from "./routes/Booking_routes";
import { createServer } from "http";
import { Socket } from "socket.io";
import { Server } from "socket.io";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});


app.use(bodyParser.json());
app.use(express.json());
app.use(UserRouter);
app.use(LoginRouter);
app.use(HallRouter);
app.use(BookingRouter);
const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PSWD,
      database: "isdl_database",
      synchronize: true,
      logging: true,
      entities: [User, Hall, Booking],
    });
    console.log("connected to database !");
  } catch (error) {
    console.log(error);
  }
};
main();
app.get("/", function (req, res) {
  res.send("hello");
});
app.listen(4000, () => {
  console.log("Server started");
});
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log("user connected : " + socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (message) => {
    console.log("received message:", message);
    io.emit("message", message);
  });
  
  socket.on("join", (roomName: string) => {
    console.log("user joined room "+ roomName)
    if (roomName !== undefined && roomName !== "undefined") {
      socket.join(roomName);
    }
  });
  socket.on("leave", (roomName: string) => {
    console.log("user left room "+ roomName)
    if (roomName !== undefined && roomName !== "undefined") { 
      socket.leave(roomName);
    }
  });
  socket.on("change", (roomName: string) => {
    console.log("change on "+ roomName)
    if (roomName !== undefined && roomName !== "undefined") {
        socket.to(roomName).emit("update");
    }
  });
});

server.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});

