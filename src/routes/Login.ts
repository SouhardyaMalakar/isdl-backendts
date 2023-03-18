import express from "express";
const router = express.Router();
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
require("dotenv").config();
import bcrypt from "bcrypt";

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const secret: string = process.env.ACCESS_TOKEN_SECRET as string;
  const user: User | null = await User.findOneBy({ email: email });
  if (user == null) {
    res.send("User not Found!");
  }
  // use hash matcher
  else if (user.password == password) {
    bcrypt.compare(user.password, password, (err, result) => {
      if (err) {
        console.error(err);
      } else if (result === true) {
        const token = jwt.sign({ ...user }, secret);
        res.send({ jwt: token });
      } else {
        console.log("Incorrect password!");
      }
    });
  }
});

export { router as LoginRouter };
