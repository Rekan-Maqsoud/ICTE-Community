import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { logout } from '../../assets/appwritedb'
import { useRouter } from 'expo-router'
import { AuthContext } from '../AuthContext'

const profile = () => {
  const {LoggedIn, setLoggedIn , setCurrentUser, setLoading} = useContext(AuthContext);
  const router = useRouter();


  const handleLogout = async( ) => {
    setLoading(true)
    if(!LoggedIn) {
      setCurrentUser('')
      setLoading(false);
      router.replace('/(auth)/signIn')
      return;
    }
    await logout();
    await setLoggedIn(false);
    setCurrentUser('')
    setLoading(false);
    router.replace('/(auth)/signIn')  
  }
  return (
      <TouchableOpacity style={styles.rowContainer}onPress={handleLogout}>
        <Image style={styles.icon} source={require('../../assets/images/sign-out.png')}/>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity> 

  )
}

export default profile

const styles = StyleSheet.create({
  rowContainer:{
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    margin: 'auto',
    alignSelf: 'center',
    marginVertical: '90%'

  },
  icon: {
    
    height: 30,
    width: 30,
    marginHorizontal: 10,
    paddingTop: 5,
  },
  text:{
    
    fontSize: 20,
    color: "#292929",
  }
})