'use server';

import { auth, signIn, signOut } from '@/auth';
import { IUserName, IUserSignIn, IUserSignUp } from '@/types';
import { redirect } from 'next/navigation';
import { UserSignInSchema } from '../validator';
import { connectToDatabase } from '../db';
import bcrypt from 'bcryptjs';
import User from '../db/models/user.model';
import { formatError } from '../utils';

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false });
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

export const SignInWithGoogle = async () => {
  await signIn('google');
};

// create
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignInSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });
    await connectToDatabase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

// update
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error('User not found');
    currentUser.name = user.name;
    const updatedUser = await currentUser.save();
    return {
      success: true,
      message: 'User name updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}
