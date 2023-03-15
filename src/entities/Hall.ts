import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Booking } from "./Booking"
 
@Entity('hall')
// hall is the name of the table
export class Hall extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name :string;

    @Column({unique:true})
    email: string;

    @OneToMany(() => Booking, booking => booking.id, {cascade:true})
    bookings: Booking[]
    
    @Column()
    hall_location : string;

    @Column()
    hall_capacity : number;

    @Column()
    hall_rating : number;

    @Column()
    hall_image : string;

    @Column("int", { array: true })
    hall_selectedslots: number[];

}

