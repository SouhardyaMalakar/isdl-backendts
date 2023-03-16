import express from "express";
const router = express.Router();
import Jwt from "jsonwebtoken";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { Hall } from "../entities/Hall";
import jwt_decode from "jwt-decode";

router.post("/api/createBooking", async (req, res) => {
  const { hall_id, jwt, date, start, end } = req.body;
  const dt: string = date.toString();
  const dat = dt.split("/");
  let m = dat[1];
  let d = dat[0];
  if (m.length == 1) m = "0" + m;
  if (d.length == 1) d = "0" + d;
  const dte = dat[2] + "-" + m + "-" + d;
  
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  let verify; 
  try{
    verify = Jwt.verify(jwt, secret);
  }catch(err){
    res.send(err.body);
  }
  if (verify) {
    const user: User = jwt_decode(jwt);
    const hall: Hall | null = await Hall.findOneBy({ id: hall_id });
    if (!user || !hall) {
      return res.send("user does not exist !");
    }
    const booking = Booking.create({
      actor: user,
      hall: hall,
      booked: false,
      pending: true,
      slotStart: dte + "T" + start.slice(0, 5),
      slotEnd: dte + "T" + end.slice(0, 5),
    });
    await booking.save();
    res.send(booking);
  } else return res.send("user does not exist !");
});

router.get("/api/getAllBookings", async (req, res) => {
  const Bookings: Booking[] | null = await Booking.find();
  res.send(Bookings);
});
router.post("/api/getHallBookings", async (req, res) => {
  const Bookings = await Booking.find({
    where: {
      hall: { id: req.body.id },
    },
  });
  res.send(Bookings);
});

router.post("/api/getUserBookings", async (req, res) => {
  const { jwt } = req.body;
  if (!jwt) return res.send("unauthorised access");
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  let verify; 
  try{
    verify = Jwt.verify(jwt, secret);
  }catch(err){
    return res.send(err.body);
  }
  if (verify) {
    const user: User = jwt_decode(jwt);
    const Bookings = await Booking.find({
      where: {
        actor: { id: user.id },
      },
    });
    res.send(Bookings);
  }
  else return res.send("something went wrong !")
});

export { router as BookingRouter };
