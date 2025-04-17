'use client';
import { UserSignInSchema } from '@/lib/validator';
import { IUserSignIn } from '@/types';
import { redirect, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { toast } from 'sonner';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'admin@example.com',
        password: 'password',
      }
    : {
        email: '',
        password: '',
      };

export default function CredentialsSignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });
  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast(
        <div>
          <p className="font-bold text-red-600">Error</p>
          <p>Invalid email or password</p>
        </div>
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit">Sign In</Button>
          </div>
          <div className="text-sm">
            By signing in, you agree to {APP_NAME}&apos;s{' '}
            <Link href={'/page/conditions-of-use'}>Conditions of Use</Link> and{' '}
            <Link href={'/page/privacy-policy'}>Privacy Policy</Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
