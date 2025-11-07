"use client";
import { Notify } from "../components/pageParts";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [ error , setError ] = useState(false)
  const { data: session , status } = useSession()
  const [ refresh , setRefresh ] = useState(true)
  const [ deleted , setDeleted ] = useState(false)
  const [ changed , setChanged ] = useState(false)
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
          const extra = await res.json();
          if (!res.ok) {
            setError(true)
            if (extra.error === 'User not found') {
              signOut()
              setDeleted(true)
              setChanged(false)
            }
          }
          else {
            if (extra.provider !== session.user.provider || extra.email !== session.user.email){
              signOut()
              setChanged(true)
              setDeleted(false)
            }
            else setUserDetails({ ...session.user, ...extra })
          }
        } catch (err) {
          setError(err)
          console.error("Failed to fetch user details");
        }
      };
      fetchExtraUserData();
    } else {
      setUserDetails(null);
    }
  }, [ session , status , refresh ]);

  return (
    <UserContext.Provider value={{ userDetails, status, error, setUserDetails, status , setRefresh }}>
      { deleted && <Notify message='User does not exist or may have been deleted' setCondition={setDeleted(false)} types='error' />}
      { changed && <Notify message='User settings changed across sessions. Please validate account ownership.' setCondition={setChanged(false)} types='error' />}
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
