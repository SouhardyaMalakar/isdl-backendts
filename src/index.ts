import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { createConnection } from "typeorm";

const app=express();
// middleware
app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
const main = async () =>{
    try {
        await createConnection();
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
