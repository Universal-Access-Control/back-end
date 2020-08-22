import { Resolver, Mutation, Arg, Query, Ctx, UseMiddleware, ArgumentValidationError } from 'type-graphql';
import bcrypt from 'bcrypt';
import _ from 'underscore';

import { CreateUserInput, UpdateUserInput, LoginInput } from '../types/user-types';
import { User, UserModel } from '../../models/user';
import { MyContext } from '../../@types/access-control';
import { isAuth } from '../middlewares/isAuth';
import { UserInputError } from 'apollo-server-express';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    const { userId } = ctx.req.session!;

    if (!userId) return null;

    return await UserModel.findById(userId);
  }

  @Query(() => Boolean)
  async checkAuth(@Ctx() ctx: MyContext): Promise<Boolean> {
    const { userId } = ctx.req.session!;
    return !!userId;
  }

  @Mutation(() => User, { nullable: true })
  async login(@Arg('user') { email, password }: LoginInput, @Ctx() ctx: MyContext): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    const error = new ArgumentValidationError([
      {
        children: [],
        property: 'inputs',
        constraints: { inputs: 'Invalid email or password!' },
      },
    ]);

    if (!user) {
      throw error;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw error;
    }

    ctx.req.session!.userId = user._id;

    return user;
  }

  @Mutation(() => User)
  async register(@Arg('user') { email, password, firstName, lastName }: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();

    return newUser;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      ctx.req.session!.destroy((err) => {
        if (err) {
          reject(false);
        }

        resolve(true);
      });
    });
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateMe(@Arg('user') { firstName, lastName }: UpdateUserInput, @Ctx() ctx: MyContext): Promise<User | null> {
    const user = await UserModel.findOneAndUpdate(
      { _id: ctx.req.session!.userId },
      {
        $set: _.pick({ firstName, lastName }, _.isString),
      },
    );

    return user;
  }
}
