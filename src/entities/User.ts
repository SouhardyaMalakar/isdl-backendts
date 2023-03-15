import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Booking } from "./Booking"
 
@Entity('user')
// user is the name of the table
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

    @OneToMany(() => Booking, booking => booking.actor)
    bookings: Booking []

    @Column()
    isAdmin: boolean;

    
}


