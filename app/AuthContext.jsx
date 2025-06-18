import { createContext, useEffect, useState } from 'react';
import { ActivityIndicator,StyleSheet , View } from 'react-native';
import { getProfile } from '../assets/appwritedb';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [LoggedIn, setLoggedIn] = useState(false);
  const [name , setName] = useState('Guest')
  const [pfp , setPfp] = useState('')
  const [loading , setLoading] = useState(true)
  const [Active, setActive] = useState(false)
  const [CurrentUser , setCurrentUser] = useState('')
  const [repliesShown , setRepliesShown] = useState(false)
  const [currentPost , setCurrentPost] = useState('')

  useEffect(()=>{
   setup();
  }, [CurrentUser, LoggedIn])

  const setup = async ()=>{
     if(CurrentUser && LoggedIn){
      const profile = await getProfile(CurrentUser.$id)
      setPfp(profile)
      setName(CurrentUser.name);}
      else if (!CurrentUser && !LoggedIn){
        setName('')
        setPfp('')
      }
      
  }

  return (
    <AuthContext.Provider value={{ 
      LoggedIn, setLoggedIn ,
      name, setName,
      pfp , setPfp,
      loading, setLoading,
      Active , setActive,
      CurrentUser, setCurrentUser,
      repliesShown,setRepliesShown,
      currentPost, setCurrentPost,
      }}>
        {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0099ff" />
        </View>
      )}
      {children}
    </AuthContext.Provider>
  );
};
export default function whatever (){
  return {AuthContext,AuthProvider}
}


const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});