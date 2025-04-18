import NextAuth, { DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import CredentialProviders from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import authConfig from './auth.config';
import client from './lib/db/client';
import { connectToDatabase } from './lib/db';
import User from './lib/db/models/user.model';

declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialProviders({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();
        if (credentials == null) return null;
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase();
          if (user.id) {
            await User.findOneAndUpdate(
              { _id: user.id },
              {
                name: user.email!.split('@')[0],
                role: 'user',
              }
            );
          }
        }

        token.id = user.id;
        token.name = user.name || user.email?.split('@')[0];
        token.role = (user as { role: string }).role;
      }

      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },

    session: async ({ session, token, trigger }) => {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.name = token.name;
      if (trigger === 'update') {
        session.user.name = token.name;
      }
      return session;
    },
  },
});
