import  express  from "express";
const router = express.Router();
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
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
    else{
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({...user},secret);
            res.send({jwt:token});
        } else {
            console.log('Password is incorrect');
        }
    }
});

export{
    router as LoginRouter
}