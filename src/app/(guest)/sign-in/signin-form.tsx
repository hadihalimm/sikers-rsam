'use client';

import { useAppForm } from '@/components/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username tidak boleh kosong' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

const SignInForm = ({ className, ...props }: React.ComponentProps<'form'>) => {
  const router = useRouter();
  const [errorResponse, setErrorResponse] = useState<{
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  } | null>(null);
  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const { error } = await authClient.signIn.username({
          username: value.username,
          password: value.password,
        });
        if (error) {
          setErrorResponse(error);
          formApi.setFieldValue('username', '');
          formApi.setFieldValue('password', '');
          return;
        }
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to SIKeRS</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sistem Informasi Kinerja Rumah Sakit
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {errorResponse && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{errorResponse.statusText}</AlertTitle>
            <AlertDescription>{errorResponse.message}</AlertDescription>
          </Alert>
        )}
        <form.AppField name="username">
          {(field) => <field.TextField label="Username" />}
        </form.AppField>
        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="mt-4">Sign in</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
};

export default SignInForm;
