'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetSettingsQuery } from '@/redux/featured/setting/settingAPI';

export default function AuthForm() {
  const { data: settings } = useGetSettingsQuery();
  const site: any = settings?.[0];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loginWithGoogle = () => {
    // full current URL (path + query)
    const fullPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const callbackUrl = encodeURIComponent(fullPath);

    router.push(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/google?callbackUrl=${callbackUrl}`
    );
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-gray-200/80 rounded-3xl p-10 flex flex-col items-center">

        {/* Logo */}
        <Link href="/" className="mb-6 block">
          <Image
            src={site?.siteLogo ?? ''}
            alt={site?.siteName ?? 'Logo'}
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>

        <p className="text-sm text-gray-500 text-center mb-8">
          Sign in to continue
        </p>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          className="w-full h-[46px] rounded-full bg-black text-white flex items-center justify-center gap-2"
        >
          <Image src="/google.png" alt="Google" width={18} height={18} />
          Continue with Google
        </button>
      </div>
    </section>
  );
}