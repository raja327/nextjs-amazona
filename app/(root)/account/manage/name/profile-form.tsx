'use client';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUserName } from '@/lib/actions/user.actions';
import { UserInputSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const ProfileForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof UserInputSchema>>({
    resolver: zodResolver(UserInputSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      name: session?.user?.name!,
    },
  });
  async function onSubmit(values: z.infer<typeof UserInputSchema>) {
    const res = await updateUserName(values);
    if (!res.success) {
      toast.error(res.error);
    }
    const { data, message } = res;
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data.name,
      },
    };
    await update(newSession);
    toast.success(message);
    router.push('/account/manage');
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold">New name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="button col-span-2 w-full">
          {form.formState.isSubmitting ? 'Submitting...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};
