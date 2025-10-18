"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [ error , setError ] = useState(false)
  const { data: session , status } = useSession()
  const [ refresh , setRefresh ] = useState(true)
  const [ userDetails , setUserDetails ] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session.user) {
      const fetchExtraUserData = async () => {
        setError(false)
        setUserDetails({...session.user, role: 'user', backupEmail: null, recoveryQuestions: []})
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
          !res.ok && setError(true)
          const extra = await res.json();
          res.ok && setUserDetails({ ...session.user, ...extra });
        } catch (err) {
          setError(err)
          console.error("Failed to fetch user details");
        }
      };
      fetchExtraUserData();
    } else {
      setUserDetails(null);
    }
  }, [session, status , refresh ]);

  return (
    <UserContext.Provider value={{ userDetails, status, error, setUserDetails, status , setRefresh }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
