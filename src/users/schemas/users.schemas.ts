import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Schema()
class Address {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  region: string;

  @Prop()
  taxCode: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  address2: string;

  @Prop({ required: true })
  subDistrict: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  county: string;

  @Prop({ required: true })
  postalCode: string;
}

const AddressSchema = SchemaFactory.createForClass(Address);

export type UsersDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  phone: string;

  @Prop({ type: AddressSchema })
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  googleId: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
