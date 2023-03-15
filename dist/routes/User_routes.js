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
const transporter = nodemailer_1.default.createTransport({
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
    const secret = "kingcrab";
    const verify = jsonwebtoken_1.default.verify(jwt, secret);
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        console.log(user);
        if (user.isAdmin) {
            const pendings = yield Booking_1.Booking.find({
                where: {
                    pending: true,
                },
            });
            res.send(pendings);
        }
        else {
            res.send("Invalid Access");
        }
    }
}));
router.post("/api/acceptRequest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwt, id, ac } = req.body;
    const secret = "kingcrab";
    const verify = jsonwebtoken_1.default.verify(jwt, secret);
    if (verify) {
        const user = (0, jwt_decode_1.default)(jwt);
        const booking = yield Booking_1.Booking.findOneBy({ id: id });
        if (user.isAdmin && booking) {
            booking.pending = false;
            yield Booking_1.Booking.delete({ id: id });
            if (ac) {
                Booking_1.Booking.update({ id: id }, Object.assign({}, booking));
                transporter.sendMail(mailData1, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            else {
                transporter.sendMail(mailData2, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log(info);
                });
            }
            res.send(ac);
        }
        else {
            res.send("Invalid Access");
        }
    }
}));
//# sourceMappingURL=User_routes.js.map