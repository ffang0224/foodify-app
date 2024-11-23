// import { useState, useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";

// export const useAuthUser = () => {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       try {
//         setUser(firebaseUser);

//         if (firebaseUser) {
//           // Get the user's Firestore data
//           const response = await fetch(`http://localhost:8000/users/auth/${firebaseUser.uid}`);

//           if (!response.ok) {
//             throw new Error("Failed to fetch user data");
//           }

//           const data = await response.json();
//           setUserData(data);
//         } else {
//           setUserData(null);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return { user, userData, loading, error };
// };
// hooks/useAuthUser.js
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
              setUser(firebaseUser);
      
              if (firebaseUser) {
                // Get the user's Firestore data
                const response = await fetch(`http://localhost:8000/users/auth/${firebaseUser.uid}`);
      
                if (!response.ok) {
                  throw new Error("Failed to fetch user data");
                }
      
                const data = await response.json();
                setUserData(data);
              } else {
                setUserData(null);
              }
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          });
      
          return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserData = async (updateData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const userId = auth.currentUser.uid;
      
      const response = await fetch(`/users/auth/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user data');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    userData,
    loading,
    error,
    updateUserData,
    refreshUserData: () => fetchUserData(auth.currentUser?.uid),
  };
};