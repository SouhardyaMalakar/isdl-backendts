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
router.get("/api/createBooking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hall_id, jwt, date, start, end } = req.body;
    console.log(date);
    const secret = 'kingcrab';
    const verify = jsonwebtoken_1.default.verify(jwt, secret);
    if (verify) {
        const user = (0, jwt_decode_1.default)(req.body.token);
        const hall = yield Hall_1.Hall.findOneBy({ id: parseInt(hall_id) });
        if (!user || !hall) {
            return res.send("user does not exist !");
        }
        const booking = Booking_1.Booking.create({
            actor: user,
            hall: hall,
            booked: false,
            pending: true,
        });
        yield booking.save();
        res.send(booking);
    }
    else
        return res.send("user does not exist !");
}));
router.get("/api/getAllBookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Bookings = yield Booking_1.Booking.find();
    console.log(Bookings);
    res.send(Bookings);
}));
router.get("/api/getUserBookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt } = req.body;
    const secret = 'kingcrab';
    const verify = jsonwebtoken_1.default.verify(jwt, secret);
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        const Bookings = yield Booking_1.Booking.find({
            where: {
                actor: { id: user.id }
            }
        });
        res.send(Bookings);
    }
}));
//# sourceMappingURL=Booking_routes.js.map