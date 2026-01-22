import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';


export enum OrderStatus {
  Pending = 'PENDING',
  confirm = 'CONFIRMED',
  cancle = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column('decimal')
  totalAmount: number;

  @Column({
      type: 'enum',
      enum: OrderStatus,
      default: OrderStatus.Pending,
    })
  status: OrderStatus;
}

