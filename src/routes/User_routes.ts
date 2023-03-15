import express from "express";
const router = express.Router();
import { User } from "../entities/User";
import Jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { Booking } from "../entities/Booking";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    port: 465,              
    host: "smtp.gmail.com",
        auth: {
            user: '20ucs197@lnmiit.ac.in',
            pass: 'Jesus@69420',
        },
    secure: true,
});
const mailData1 = {
    from: '20ucs197@lnmiit.ac.in',  
    to: 'souhardyamalakar.cob@gmail.com',  
    subject: 'LHMS Booking',
    text: 'Request Accecpted'
};
const mailData2 = {
    from: '20ucs197@lnmiit.ac.in',  
    to: 'souhardyamalakar.cob@gmail.com',   
    subject: 'LHMS Booking',
    text: 'Request Denied'
};

router.post("/api/register", async (req, res) => {
  const { name, email, password, username, isAdmin } = req.body;
  const user1: User | null = await User.findOneBy({ email: email });
  if (user1 != null) res.send("Email already taken");
  else {
    const user = User.create({
      name: name,
      email: email,
      password: password,
      username: username,
      isAdmin: isAdmin,
    });
    await user.save();
    res.send(user);
  }
});

router.post("/api/getAllPending", async (req, res) => {
  const { jwt } = req.body;
  const secret = "kingcrab";
  const verify = Jwt.verify(jwt, secret);
  if (verify) {
    const user: User = jwt_decode(jwt);
    console.log(user);
    if (user.isAdmin) {
      const pendings = await Booking.find({
        where: {
          pending: true,
        },
      });
      res.send(pendings);
    } else {
      res.send("Invalid Access");
    }
  }
});

router.post("/api/acceptRequest", async (req, res) => {
  const { jwt, id, ac } = req.body;
  const secret = "kingcrab";
  const verify = Jwt.verify(jwt, secret);
  if (verify) {
    const user: User = jwt_decode(jwt);
    const booking = await Booking.findOneBy({id:id})
    if (user.isAdmin && booking) {
        booking.pending=false;
        await Booking.delete({id:id});
        if(ac){
            Booking.update({id:id},{...booking})
            transporter.sendMail(mailData1, function (err, info) {
                if(err)
                console.log(err)
                else
                console.log(info);
            });
        }
        else{
            transporter.sendMail(mailData2, function (err, info) {
                if(err)
                console.log(err)
                else
                console.log(info);
            });
        }
        
      res.send(ac);
    } else {
      res.send("Invalid Access");
    }
  }
});

export { router as UserRouter };
