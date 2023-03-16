"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hall = void 0;
const typeorm_1 = require("typeorm");
const Booking_1 = require("./Booking");
let Hall = class Hall extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ primary: true }),
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Hall.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hall.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking_1.Booking, booking => booking.hall, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Hall.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hall.prototype, "hall_location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hall.prototype, "hall_capacity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hall.prototype, "hall_rating", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hall.prototype, "hall_image", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Hall.prototype, "hall_selectedslots", void 0);
Hall = __decorate([
    (0, typeorm_1.Entity)('hall')
], Hall);
exports.Hall = Hall;
//# sourceMappingURL=Hall.js.map