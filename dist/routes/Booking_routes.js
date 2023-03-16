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
exports.BookingRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.BookingRouter = router;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Booking_1 = require("../entities/Booking");
const Hall_1 = require("../entities/Hall");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
router.post("/api/createBooking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hall_id, jwt, date, start, end } = req.body;
    const dt = date.toString();
    const dat = dt.split("/");
    let m = dat[1];
    let d = dat[0];
    if (m.length == 1)
        m = "0" + m;
    if (d.length == 1)
        d = "0" + d;
    const dte = dat[2] + "-" + m + "-" + d;
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
        const hall = yield Hall_1.Hall.findOneBy({ id: hall_id });
        if (!user || !hall) {
            return res.send("user does not exist !");
        }
        const booking = Booking_1.Booking.create({
            actor: user,
            hall: hall,
            booked: false,
            pending: true,
            slotStart: dte + "T" + start.slice(0, 5),
            slotEnd: dte + "T" + end.slice(0, 5),
        });
        yield booking.save();
        res.send(booking);
    }
    else
        return res.send("user does not exist !");
}));
router.get("/api/getAllBookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Bookings = yield Booking_1.Booking.find();
    res.send(Bookings);
}));
router.post("/api/getHallBookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Bookings = yield Booking_1.Booking.find({
        where: {
            hall: { id: req.body.id },
        },
    });
    res.send(Bookings);
}));
router.post("/api/getUserBookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.body;
    if (!jwt)
        return res.send("unauthorised access");
    const secret = process.env.ACCESS_TOKEN_SECRET;
    let verify;
    try {
        verify = jsonwebtoken_1.default.verify(jwt, secret);
    }
    catch (err) {
        return res.send(err.body);
    }
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        const Bookings = yield Booking_1.Booking.find({
            where: {
                actor: { id: user.id },
            },
        });
        res.send(Bookings);
    }
    else
        return res.send("something went wrong !");
}));
//# sourceMappingURL=Booking_routes.js.map