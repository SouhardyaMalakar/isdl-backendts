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
exports.LoginRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.LoginRouter = router;
const User_1 = require("../entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
router.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const user = yield User_1.User.findOneBy({ email: email });
    if (user == null) {
        res.send("User not Found!");
    }
    else if (user.password == password) {
        const token = jsonwebtoken_1.default.sign(Object.assign({}, user), secret);
        res.send({ jwt: token });
    }
    else
        res.send("Wrong Password!");
}));
//# sourceMappingURL=Login.js.map