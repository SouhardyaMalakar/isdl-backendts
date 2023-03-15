import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne} from "typeorm"
import { Booking } from "./Booking"
 
@Entity('hall')
// hall is the name of the table
export class Hall extends BaseEntity {

    @Column({ primary: true})
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name :string;

    @OneToMany(() => Booking, booking => booking.hall)
    bookings: Booking[]
    
    @Column()
    hall_location : string;

    @Column()
    hall_capacity : number;

    @Column()
    hall_rating : number;

    @Column()
    hall_image : string;

    @Column("int", { array: true, nullable:true })
    hall_selectedslots: number[];

}

