import express from "express";
const router = express.Router();
import Jwt from "jsonwebtoken";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { Hall } from "../entities/Hall";
import jwt_decode from "jwt-decode"

router.get("/api/createBooking", async (req, res) => {
  const {
    hall_id, 
    jwt,
    date,
    start,
    end
  }=req.body;
  console.log(date)
    const secret ='kingcrab'
    const verify = Jwt.verify(jwt,secret);
    if(verify){
      const user : User = jwt_decode(req.body.token);
      const hall : Hall | null = await Hall.findOneBy({id :parseInt(hall_id)});
      if(!user || !hall){
        return res.send("user does not exist !");
      }
      const booking = Booking.create({
        actor:user,
        hall: hall,
        booked: false,
        pending: true,
        // need to fix this
        // slotStart: date + start,
        // slotEnd: Date()
    });
      await booking.save();
      res.send(booking)
    }
    else return res.send("user does not exist !");
});

router.get("/api/getAllBookings", async (req, res) => {
  const Bookings : Booking [] | null  = await Booking.find();
  console.log(Bookings);
  res.send(Bookings);
});

router.get("/api/getUserBookings", async (req, res) => {
  const {
    jwt
  }=req.body;
    const secret ='kingcrab'
    const verify = Jwt.verify(jwt,secret);
    if(verify){
      const user : User = jwt_decode(jwt);
      const Bookings = await Booking.find({
        where: {
          actor: { id: user.id } 
        }
      });
      res.send(Bookings);
    }
});

export { router as BookingRouter };
