import { StyleSheet, Text , View , TouchableOpacity , Image, TextInput, ScrollView , KeyboardAvoidingView} from 'react-native'
import {  useContext,  useState } from 'react'
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import { newPost, uploadedURL } from '../../assets/appwritedb'
import { useRouter } from 'expo-router'
import { AuthContext } from '../AuthContext'

const createPost = () => {
  const {setLoading , name , CurrentUser , pfp, loading} = useContext(AuthContext)
  const [text , setText] = useState('');
  const [selectedImage , setSelectedImage] = useState('');
  const router = useRouter();


  const pickImage = async() => {
    const {states} =  await ImagePicker.requestMediaLibraryPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
    // Get original dimensions
    const asset = result.assets[0];
    const { width, height } = asset;
    // Set a max width or height (e.g., 800px)
    const maxDim = 1400;
    let resize = {};
    if (width > height && width > maxDim) {
      resize.width = maxDim;
    } else if (height > width && height > maxDim) {
      resize.height = maxDim;
    } else if (width === height && width > maxDim) {
      resize.width = maxDim;
      resize.height = maxDim;
    }
    // Only resize if needed
    let manipulated = asset;
    if (Object.keys(resize).length > 0) {
      manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
    }
    // Get file info for size
    const fileInfo = await FileSystem.getInfoAsync(manipulated.uri);
    setSelectedImage({
      uri: manipulated.uri,
      fileSize: fileInfo.size,
      mimeType: 'image/jpeg',
    });
  }
  }

  const post = async () => {

    setLoading(true)
    let result = {URL: null, imageId: null};
    if (selectedImage) {
      result = await uploadedURL(selectedImage);
    }
    await newPost(CurrentUser.$id, name,text,result.URL || null, result.imageId || null)
    setText(null);
    setSelectedImage(null);
    setLoading(false)
    router.replace('/')
    
  }
  return (
    <KeyboardAvoidingView
          behavior='padding'
          keyboardVerticalOffset={20}
        >
      <ScrollView>
        
      <View style={style.container}>
        
      <View style={{flexDirection: 'row', }}>
              <Image source={{uri: pfp}} style={style.pfpStyle}/> 
              <Text style={style.nameStyle}>{name}</Text>
              <TouchableOpacity style={style.options}>
                  <Text style={{fontSize: 20,fontWeight: 'bold'}}>...</Text>
              </TouchableOpacity>
      </View>
      <View style={{flexWrap: 'wrap', minHeight: 20}}>
        <TextInput 
        style={style.input}
        placeholder="Type here..."
        value={text}
        multiline={true}
        onChangeText={setText}
        maxLength={1000}
      />
      </View>

      <View style={{flex: 1 , marginTop: 90}}>
      {!selectedImage ? 
      <TouchableOpacity style={style.addImage} onPress={pickImage}>

        <Image style={style.icon} source={require('../../assets/images/gallery.png')}/>
        <Text style={{fontSize: 14,fontWeight: 'semibold' , margin: 5}}>Add Image</Text>
        
      </TouchableOpacity> :
      <View style={{position: 'relative', backgroundColor: 'rgba(149, 255, 255, 0.05)'}}>

        <Image style={style.postImageStyle} source={{uri: selectedImage.uri}}/>
        <TouchableOpacity style={style.cancelImage} onPress={() => setSelectedImage(null)}>
          <Image style={{height:20,width:20}}source={require('../../assets/images/x.png')} />
        </TouchableOpacity>
        
      </View>
      }
      <TouchableOpacity onPress={post} style={style.postButton}>
          <Text style={{fontSize: 14,fontWeight: 'semibold' ,margin: 5 }}>Post Now</Text>
          <Image style={style.icon} source={require('../../assets/images/send.png')}/>
        </TouchableOpacity>
        </View>
        
      </View>
      
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default createPost

const style = StyleSheet.create({
  container:{
    marginHorizontal: 10,
    marginVertical: 50,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pfpStyle: {
        height: 40,
        width: 40,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    nameStyle: {
      color: 'rgba(31,31,31,0.7)',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#414141',
    },
    options:{
        position: 'absolute',
        right: 10,
        top: -8,
    },
    input:{
      color: 'rgba(31,31,31,0.7)',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: '90%',
      padding:10 ,
      margin: 10,
      
    },
    postImageStyle:{
        aspectRatio: 9/16,
        margin: 10,
        marginBottom: 60,
        width: '95%',
        aspectRatio: 4/5,

    },
    cancelImage: {
      top: 20,
      right: 25,
      position: 'absolute'
    },
    addImage:{
      position: 'absolute',
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(0, 186, 161, 0.2)',
      borderRadius: 12,
      left: 10,
      bottom: 15,
    },
    postButton:{
      position: 'absolute',
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(0, 186, 161, 0.2)',
      borderRadius: 12,
      right: 10,
      bottom: 15,
    },
    icon: {
      height:20,
      width: 20,
      margin:5,
    },
})