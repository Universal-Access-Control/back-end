import { InputType, Field } from 'type-graphql';
import { Length, MaxLength, IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class DeviceInput {
  @Field()
  @MaxLength(30)
  deviceId!: string;

  @Field({ nullable: true })
  @Length(1, 20)
  name?: string;

  @Field(() => String)
  @IsMongoId()
  userId!: ObjectId;
}
