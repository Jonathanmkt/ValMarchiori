'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o painel
    // O middleware já verificou a autenticação
    router.push('/painel');
  }, [router]);

  // Retorna null porque o componente vai redirecionar antes de renderizar
  return null;
}
