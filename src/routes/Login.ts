import  express  from "express";
const router = express.Router();
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
require('dotenv').config()


router.post('/api/login', async  (req,res) => {
    const {
        email,
        password
    } = req.body;
    const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
    const user : User|null = await User.findOneBy({email : email});
    if(user==null){
        res.send("User not Found!");
    }
    else if(user.password==password){
        const token = jwt.sign({...user},secret);
        res.send({jwt:token});
    }
    else res.send("Wrong Password!");
});

export{
    router as LoginRouter
}