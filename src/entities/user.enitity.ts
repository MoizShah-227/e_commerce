import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IsEmail, IsNotEmpty, IsInt, Min, IsEnum } from "class-validator";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
@Entity()
export class user{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
   
    @Column({unique:true})
    @IsEmail()
    email: string

    @Column()
    @IsNotEmpty()
    password:string
    
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    @IsEnum(UserRole)
    role: UserRole;
    
    @CreateDateColumn()
    createdAt: Date; 

}
