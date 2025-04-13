import { createContext, useContext, useState, useEffect } from 'react';
import {
  Session,
  User,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoadingProfile: boolean;
  supabaseClient: any;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabaseClient = useSupabaseClient();
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      if (user) {
        try {
          const { data } = await supabaseClient.from('profiles' as any).select('*').eq('id', user.id).single();
          setProfile(data || null);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        setProfile(null);
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, supabaseClient]);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    setProfile(null);
    router.push('/auth');
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    isLoadingProfile,
    supabaseClient,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
