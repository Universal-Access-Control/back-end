import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { UserInput } from '../types/user-types';
import { User, UserModel } from '../../models/user';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: false })
  async singleUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById({ _id: id });
  }

  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    return await UserModel.find().populate({ path: 'devices', model: 'Device' });
  }

  @Mutation(() => User)
  async addUser(@Arg('user') { username, password }: UserInput): Promise<User> {
    const newUser = (await UserModel.create({ username, password })).save();

    return newUser;
  }

  @Mutation(() => Boolean)
  async removeUser(@Arg('id') id: string): Promise<boolean> {
    await UserModel.deleteOne({ id });
    return true;
  }
}
