import Link from 'next/link';
import Image from 'next/image';
import { APP_COPYRIGHT, APP_NAME } from '@/lib/constants';
import { Toaster } from 'sonner';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen highlight-link">
      <header className="mt-8">
        <Link href={'/'}>
          <Image
            src={`/icons/logo.svg`}
            alt={`${APP_NAME} logo`}
            width={64}
            height={64}
            priority
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Link>
      </header>
      <main className="mx-auto max-w-sm min-w-80 p-4">
        <Toaster />
        {children}
      </main>
      <footer className="flex-1 mt-8 bg-gray-800 flex flex-col gap-4 items-center p-8 text-sm">
        <div className="flex justify-center space-x-4">
          <Link href={'/page/conditions-of-use'}>Conditions of use</Link>
          <Link href={'/page/privacy-policy'}>Privacy Notice</Link>
          <Link href={'/page/help'}>Help</Link>
        </div>
        <div>
          <p className="text-gray-400">{APP_COPYRIGHT}</p>
        </div>
      </footer>
    </div>
  );
}
