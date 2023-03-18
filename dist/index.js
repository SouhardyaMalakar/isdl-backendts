"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const User_routes_1 = require("./routes/User_routes");
const User_1 = require("./entities/User");
const Hall_1 = require("./entities/Hall");
const Booking_1 = require("./entities/Booking");
const Login_1 = require("./routes/Login");
const Hall_routes_1 = require("./routes/Hall_routes");
const Booking_routes_1 = require("./routes/Booking_routes");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(User_routes_1.UserRouter);
app.use(Login_1.LoginRouter);
app.use(Hall_routes_1.HallRouter);
app.use(Booking_routes_1.BookingRouter);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, typeorm_1.createConnection)({
            type: "postgres",
            host: process.env.DATABASE_HOST,
            port: 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PSWD,
            database: "isdl_database",
            synchronize: true,
            entities: [User_1.User, Hall_1.Hall, Booking_1.Booking],
        });
        console.log("connected to database !");
    }
    catch (error) {
        console.log(error);
    }
    const server = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.sockets.on("connection", (socket) => {
        console.log("user connected : " + socket.id);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("message", (message) => {
            console.log("received message:", message);
            io.emit("message", message);
        });
        socket.on("join", (roomName) => {
            console.log("user joined room " + roomName);
            if (roomName !== undefined && roomName !== "undefined") {
                socket.join(roomName);
            }
        });
        socket.on("leave", (roomName) => {
            console.log("user left room " + roomName);
            if (roomName !== undefined && roomName !== "undefined") {
                socket.leave(roomName);
            }
        });
        socket.on("change", (roomName) => {
            console.log("change on " + roomName);
            if (roomName !== undefined && roomName !== "undefined") {
                socket.to(roomName).emit("update");
            }
        });
    });
    app.get("/", function (req, res) {
        res.send("hello");
    });
    server.listen(4000, () => {
        console.log("Listening on port 8080");
    });
});
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map