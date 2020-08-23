import { InputType, Field } from 'type-graphql';
import { IsMongoId, Length, MaxLength } from 'class-validator';

@InputType()
export class DeviceInput {
  @Field()
  @MaxLength(30)
  deviceId!: string;

  @Field()
  @Length(1, 20)
  name!: string;
}

@InputType()
export class UpdateDeviceInput {
  @Field()
  @IsMongoId()
  id!: string;

  @Field()
  @Length(1, 20)
  name!: string;
}
