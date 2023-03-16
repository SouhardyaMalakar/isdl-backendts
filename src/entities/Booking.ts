import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,} from "typeorm"
import { Hall } from "./Hall";
import { User } from "./User"


@Entity('booking')
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @ManyToOne(() => User, user => user.bookings, {onDelete: 'CASCADE'})
    actor: User;
  
    @ManyToOne(() => Hall, hall => hall.bookings, {onDelete: 'CASCADE'})
    hall: Hall;

    @Column()
    booked: boolean

    @Column()
    pending: boolean

    @Column({nullable:true})
    slotStart: string

    @Column({nullable:true})
    slotEnd: string

}
