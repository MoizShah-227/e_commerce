// product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  stockQuantity: number;

  @Column()
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Order, order => order.products)
  orders: Order[];
}
