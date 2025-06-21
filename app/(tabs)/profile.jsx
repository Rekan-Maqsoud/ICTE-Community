import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useContext } from 'react'
import { logout, updatePFP, uploadedURL } from '../../assets/appwritedb'
import { useRouter } from 'expo-router'
import { AuthContext } from '../AuthContext'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const profile = () => {
  const {LoggedIn, setLoggedIn , setCurrentUser, setLoading , pfp , CurrentUser} = useContext(AuthContext);
  const router = useRouter();

  const pickImage = async() => {
      const {states} =  await ImagePicker.requestMediaLibraryPermissionsAsync();
      // if (states !== 'granted'){
      //   Alert.alert('Permission Required',
      //     'Sorry, we need camera roll permissions to make this work!',
      //     [{ text: 'OK' }])
      //     return;
      // }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1,1],
        quality: 1,
      });

    if (!result.canceled) {
      // Resize and compress the image
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 512, height: 512 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      // Get file info for size
      const fileInfo = await FileSystem.getInfoAsync(manipulated.uri);
      const result2 = await uploadedURL({
        uri: manipulated.uri,
        fileSize: fileInfo.size,
        mimeType: 'image/jpeg'
      });
      console.log(result2)
      await updatePFP(CurrentUser.$id, result2.URL, result2.imageId);
  }
    }
  const handleLogout = async( ) => {
    setLoading(true)
    if(!LoggedIn) {
      setCurrentUser('')
      setLoading(false);
      router.replace('/(auth)/signIn')
      return;
    }
    await logout();
    setLoggedIn(false);
    setCurrentUser('')
    setLoading(false);
    router.replace('/(auth)/signIn')  
  }
  return (
  <View style={styles.container}>
    <View style={styles.pfpContainer}>
      <Image source={{uri : pfp}} style={styles.profilePic}/>
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.text}>
          Change Profile Picture
        </Text>
       </TouchableOpacity>
    </View>
    <View style={styles.rowContainer}>
      <TouchableOpacity style={{flexDirection: 'row'}}onPress={handleLogout}>
        <Image style={styles.icon} source={require('../../assets/images/sign-out.png')}/>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity> 
    </View>
</View>
  )
}

export default profile

const styles = StyleSheet.create({
  container:{
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  pfpContainer:{
    flex: 1,
    flexDirection: 'column',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto'
  },
  rowContainer:{
    flex: 1,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    margin: 'auto',
  },
  icon: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  text:{
    fontSize: 20,
    color: "#292929",
  },
  profilePic:{
    height: 100,
    width: 100,
    borderRadius: 20,
  }
})