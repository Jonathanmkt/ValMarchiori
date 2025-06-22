'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface UserProfileData {
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Buscar dados adicionais do perfil se necessário
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();

          setUserData({
            email: user.email || '',
            full_name: profile?.full_name || user.user_metadata?.full_name || '',
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!userData) {
    return null;
  }

  const userInitial = userData.full_name 
    ? userData.full_name.charAt(0).toUpperCase()
    : userData.email?.charAt(0).toUpperCase() || 'U';

  // Pega apenas o primeiro nome
  const firstName = userData.full_name ? userData.full_name.split(' ')[0] : 'Usuário';

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        {userData.avatar_url ? (
          <img
            src={userData.avatar_url}
            alt="User profile"
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {userInitial}
          </div>
        )}
      </div>
      
      {/* Nome do usuário */}
      <span className="text-sm font-medium text-primary-foreground">
        {firstName}
      </span>
      
      {/* Botão de sair */}
      <button 
        onClick={handleSignOut}
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Sair"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
