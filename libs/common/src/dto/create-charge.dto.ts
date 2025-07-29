import { CardDto } from "@app/common";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import Stripe from "stripe";

export class CreateChargeDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto

    @IsNumber()
    amount: number
}