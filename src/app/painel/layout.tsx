import PainelLayout from '@/components/layout/PainelLayout';

export default function PainelRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PainelLayout>
      {children}
    </PainelLayout>
  );
}