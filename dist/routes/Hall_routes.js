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
exports.HallRouter = void 0;
const express_1 = __importDefault(require("express"));
const Hall_1 = require("../entities/Hall");
const router = express_1.default.Router();
exports.HallRouter = router;
router.post('/api/createHall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, hall_location, hall_capacity, hall_rating, hall_image } = req.body;
    const hall1 = yield Hall_1.Hall.findOneBy({ name: name });
    if (hall1 != null)
        res.send("Hall exists!");
    else {
        const hall = Hall_1.Hall.create({
            name,
            hall_location,
            hall_capacity,
            hall_rating,
            hall_image
        });
        yield hall.save();
        res.send(hall);
    }
}));
router.get('/api/getAllHalls', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const halls = yield Hall_1.Hall.find();
    res.send(halls);
}));
//# sourceMappingURL=Hall_routes.js.map