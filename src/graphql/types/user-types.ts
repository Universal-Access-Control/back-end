import { InputType, Field, ObjectType } from 'type-graphql';
import { Length, IsEmail, IsString, Matches, IsMongoId, IsOptional, MaxLength } from 'class-validator';
import { IsUserAlreadyExist } from '../validators/user-already-exist';

@InputType()
export class UserIdInput {
  @Field()
  @IsMongoId({ message: 'User not found!' })
  id!: string;
}

@InputType()
export class LoginInput {
  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  password!: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail(undefined, { message: 'Email is not valid' })
  @IsUserAlreadyExist({ message: 'Email already in use' })
  email!: string;

  @Field()
  @Length(8, 30)
  @IsString()
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: 'Password must be at least contains both number and letter',
  })
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  lastName?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(0, 255)
  lastName?: string;
}
