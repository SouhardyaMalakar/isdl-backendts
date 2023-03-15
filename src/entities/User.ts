import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Booking } from "./Booking"
 
@Entity('user')
// user is the name of the table
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name :string;

    @Column({unique:true})
    email: string;

    @OneToMany(() => Booking, booking => booking.id, {cascade:true})
    bookings: Booking[]

    @Column()
    isAdmin: boolean;

    @Column()
    username : string;

    @Column()
    password: string;
}


