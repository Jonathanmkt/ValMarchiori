'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PainelPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/painel/pacientes');
  }, [router]);

  return null;
}
