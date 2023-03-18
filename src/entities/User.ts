import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Booking } from "./Booking"
import bcrypt from "bcrypt"
@Entity('user')
export class User extends BaseEntity {
    @Column({primary: true})
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name :string;

    @Column({unique:true})
    email: string;
    
    @Column()
    password: string;

    @Column()
    username : string;

    @OneToMany(() => Booking, booking => booking.actor, {onDelete: "CASCADE"})
    bookings: Booking []

    @Column()
    isAdmin: boolean;

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }    
}


