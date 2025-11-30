"use client";
import { User } from "@/types";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, SetStateAction, Dispatch } from "react";

interface UserSet {
  error: boolean,
  status: string,
  deleted: boolean,
  userDetails: User | null,
  setRefresh: Dispatch<SetStateAction<boolean>>
  setDeleted: Dispatch<SetStateAction<boolean>>
  setUserDetails: Dispatch<SetStateAction<User | null>>
}
const UserContext = createContext<UserSet | undefined >( undefined );

export const UserProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [ error , setError ] = useState(false)
  const { data: session , status } = useSession()
  const [ refresh , setRefresh ] = useState(true)
  const [ deleted , setDeleted ] = useState(false)
  const [ userDetails , setUserDetails ] = useState< User | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      const id = session.user.id
      const fetchExtraUserData = async () => {
        setError(false)
        setUserDetails({ ...session.user, role: 'user', exclusive: false, _id: id,backupEmail: null, createdAt: null, updatedAt: null, requestLogout: true, recoveryQuestions: [] })
        try {
          const res = await fetch('/api/users/', {
            headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${session.user?.id}`,
            }
          });

          const contentType = res.headers.get('content-type')

          if (!contentType || !contentType.includes('application/json')) {
            setError(true)
            return
          }
          const extra = await res.json();
          if (!res.ok) {
            setError(true)
            if (extra.error === 'User not found') {
              signOut()
              setDeleted(true)
            }
          }
          else setUserDetails({ ...session.user, ...extra })
        } catch (err) {
          setError(true)
          console.error("Failed to fetch user details");
        }
      };
      fetchExtraUserData();
    } else {
      setUserDetails(null);
    }
  }, [ session , status , refresh ]);

  return (
    <UserContext.Provider value={{ userDetails, status, error, setUserDetails, deleted , setRefresh, setDeleted }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  
  return context;  // Now TypeScript knows it's not undefined
}
