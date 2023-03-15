import  express  from "express";
const router = express.Router();
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

router.post('/api/login', async  (req,res) => {
    console.log("here!!")
    const {
        email,
        password
    } = req.body;
    
    const user : User|null = await User.findOneBy({email : email});
    if(user==null){
        res.send("User not Found!");
    }
    else if(user.password==password){
        const token = jwt.sign({...user},'kingcrab');
        res.send({jwt:token});
    }
    else res.send("Wrong Password!");
});

export{
    router as LoginRouter
}