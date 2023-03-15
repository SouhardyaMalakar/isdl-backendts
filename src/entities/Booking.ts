import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,} from "typeorm"
import { Hall } from "./Hall";
import { User } from "./User"


@Entity('booking')
// uses is the name of the table
export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @ManyToOne(() => User, user => user.bookings, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'actor_id'
    })
    actor: User;
  
    @ManyToOne(() => Hall, hall => hall.bookings, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'hall_id'
        
    })
    hall: Hall;

    @Column()
    booked: boolean

    @Column()
    pending: boolean

    @Column({nullable:true})
    slotStart: Date

    @Column({nullable:true})
    slotEnd: Date

}
