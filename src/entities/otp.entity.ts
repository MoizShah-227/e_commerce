// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';


@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, user => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

}
