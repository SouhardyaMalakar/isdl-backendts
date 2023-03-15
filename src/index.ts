import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { createConnection } from "typeorm";
import { UserRouter } from "./routes/User_routes";
import { User } from "./entities/User";
import { Hall } from "./entities/Hall";
import { Booking } from "./entities/Booking";
import { LoginRouter } from "./routes/Login";
import { HallRouter } from "./routes/Hall_routes";
import { BookingRouter } from "./routes/Booking_routes";

const app=express();
// middleware
app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
app.use(UserRouter);
app.use(LoginRouter);
app.use(HallRouter);
app.use(BookingRouter);
const main = async () =>{
    try {
        await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "2002",
            database: "postgres",
            synchronize: true,
            logging: true,
            entities: [User,Hall,Booking],
        });
        console.log("connected to database !")
    }catch(error){
        console.log(error);
    }
}
main();
app.get("/", function(req,res){
    res.send("hello")
})
app.listen(4000, ()=>{
    console.log("Server started");    
})
