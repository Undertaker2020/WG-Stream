import {Field, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

@InputType()
export class ChangeStreamInfoInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public title: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    public categoryId?: string;
}