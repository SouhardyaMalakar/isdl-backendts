"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.UserRouter = router;
const User_1 = require("../entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const Booking_1 = require("../entities/Booking");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const pswd = process.env.ACCESS_PASSWORD;
const transporter = nodemailer_1.default.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: "jesus2169.god@gmail.com",
        pass: pswd,
    },
    secure: true,
});
router.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, username, isAdmin } = req.body;
    const user1 = yield User_1.User.findOneBy({ email: email });
    if (user1 != null)
        res.send("Email already taken");
    else {
        const user = User_1.User.create({
            name: name,
            email: email,
            password: password,
            username: username,
            isAdmin: isAdmin,
        });
        yield user.save();
        res.send(user);
    }
}));
router.post("/api/getAllPending", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.body;
    if (!jwt)
        return res.send("unauthorised access");
    const secret = process.env.ACCESS_TOKEN_SECRET;
    let verify;
    try {
        verify = jsonwebtoken_1.default.verify(jwt, secret);
    }
    catch (err) {
        res.send(err.body);
    }
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        if (user.isAdmin) {
            const pendings = yield Booking_1.Booking.find({
                where: {
                    pending: true,
                },
                relations: ['actor', 'hall']
            });
            res.send(pendings);
        }
        else {
            res.send("Invalid Access");
        }
    }
    return;
}));
router.post("/api/acceptRequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt, id, ac } = req.body;
    if (!jwt)
        return;
    const secret = process.env.ACCESS_TOKEN_SECRET;
    let verify;
    try {
        verify = jsonwebtoken_1.default.verify(jwt, secret);
    }
    catch (err) {
        res.send(err.body);
    }
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        const booking = yield Booking_1.Booking.findOne({
            where: { id: id },
            relations: ['actor', 'hall']
        });
        console.log(booking);
        if (user.isAdmin && booking) {
            booking.pending = false;
            const mailData = {
                from: "jesus2169.god@gmail.com",
                to: booking.actor.email,
                subject: "LHMS Booking",
                text: "Request Accecpted",
            };
            if (ac) {
                Booking_1.Booking.update({ id: id }, Object.assign({}, booking));
            }
            else {
                yield Booking_1.Booking.delete({ id: id });
                mailData.text = "Request Rejected";
            }
            transporter.sendMail(mailData, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
            res.send("oka");
        }
        else {
            res.send(null);
        }
    }
}));
router.post("/api/dropAll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.DATABASE_DROP_SECRET;
    if (req.body.secret == secret) {
        yield Booking_1.Booking.clear();
        res.send("Datebase clear");
        return;
    }
}));
//# sourceMappingURL=User_routes.js.map