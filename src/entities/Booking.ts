import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne,} from "typeorm"
import { Hall } from "./Hall";
import { User } from "./User"


@Entity('booking')
// uses is the name of the table
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @ManyToOne(() => User, user => user.id , {cascade:true})
    actor: User;
  
    @ManyToOne(() => Hall, hall => hall.id, {cascade:true})
    hall: Hall;

    @Column()
    booked: boolean

    @Column()
    pending: boolean

    @Column()
    slotStart: Date

    @Column()
    slotEnd: Date

}
