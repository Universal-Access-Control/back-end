import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '../../models/user';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @Length(8, 50)
  username!: string;

  @Field()
  @Length(8, 30)
  password!: string;
}
