import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto{
    @ApiProperty({example:"Moiz Hassan"})
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty({example:"moiz123@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({example:"123"})
    @IsString()
    @IsNotEmpty()
    password:string

    // @ApiProperty({example:"user"})
    @IsString()
    @IsOptional()
    role:string
}


export class loginDto{
    @ApiProperty({example:"moiz123@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({example:"123"})
    @IsString()
    @IsNotEmpty()
    password:string
}