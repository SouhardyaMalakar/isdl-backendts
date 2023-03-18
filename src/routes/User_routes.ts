import express from "express";
const router = express.Router();
import { User } from "../entities/User";
import Jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { Booking } from "../entities/Booking";
import nodemailer from "nodemailer";
require("dotenv").config();

const pswd: string = process.env.ACCESS_PASSWORD as string;

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.ACCESS_EMAIL,
    pass: pswd,
  },
  secure: true,
});
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
  if (!jwt) return res.send("unauthorised access");
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;

  let verify;
  try {
    verify = Jwt.verify(jwt, secret);
  } catch (err) {
    res.send(err.body);
  }
  if (verify) {
    const user: User = jwt_decode(jwt);
    if (user.isAdmin) {
      const pendings = await Booking.find({
        where: {
          pending: true,
        },
        relations: ['actor','hall']
      });
      res.send(pendings);
    } else {
      res.send("Invalid Access");
    }
  }
  return;
});

router.post("/api/acceptRequest", async (req, res) => {
  const { jwt, id, ac } = req.body;
  if (!jwt) return;
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  let verify;
  try {
    verify = Jwt.verify(jwt, secret);
  } catch (err) {
    res.send(err.body);
  }
  if (verify) {
    const user: User = jwt_decode(jwt);
    const booking = await Booking.findOne({ 
      where: { id: id },
      relations: ['actor','hall']
    });
    if (user.isAdmin && booking) {
      booking.pending = false;
      const mailData = {
        from: process.env.ACCESS_EMAIL,
        to: booking.actor.email,
        subject: "LHMS Booking",
        text: "Hall booking request Accecpted !!" + "\n Hall : " + booking.hall.id + "\n Start: "+  booking.slotStart + "\n End: "+ booking.slotEnd
      };
      if (ac) {
        Booking.update({ id: id }, { ...booking });
      } else {
        await Booking.delete({ id: id });
        mailData.text = "Hall booking request Rejected !!" + "\n Hall : " + booking.hall.id + "\n Start: "+  booking.slotStart + "\n End: "+ booking.slotEnd
        
      }
      transporter.sendMail(mailData, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
      });
      res.send("oka");
    } else {
      res.send(null);
    }
  }
});
router.post("/api/dropAll", async (req, res) => {
  const secret: string = process.env.DATABASE_DROP_SECRET as string;
  if (req.body.secret == secret) {
    await Booking.clear();
    // await Hall.clear();
    // await User.clear();
    res.send("Datebase clear");
    return;
  }
});
export { router as UserRouter };
