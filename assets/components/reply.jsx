import { useRef, useMemo, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text,Image, TouchableOpacity, Alert  } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { AuthContext } from "../../app/AuthContext";
import {  getReplies, newReply } from "../appwritedb";
import { TextInput } from "react-native-gesture-handler";
import RenderReplies from "./renderReplies";

const Reply = () => {
  const {setRepliesShown , repliesShown, currentPost, setCurrentPost, CurrentUser , loading,setLoading , pfp , name}= useContext(AuthContext);
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [ "100%"], []);
  const [replies , setReplies] = useState('')
  const [reply, setNewReply] = useState('')
  
  const handleReplies = async () => {
    
    const result = await getReplies(currentPost)
    const resultPro = Object.values(result.documents)
    setReplies(resultPro)
  }
  const handleReply = async ()=>{
    if(reply === ''){
      Alert.alert('Type the Answer ..!')
      return;
    }
    setLoading(true)
    await newReply(CurrentUser.$id , reply, currentPost)
    setNewReply('');
    setReplies('')
    setLoading(false)
  }

  useEffect(() => {
     handleReplies()
    if(repliesShown)
      sheetRef.current?.snapToIndex(1);
    else 
      sheetRef.current?.close();
  }, [repliesShown, loading]);

  return (
    <View style={styles.container}>
    
        
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={true}
        enablePanDownToClose
        enableContentPanningGesture={true}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onClose={() => {
          setRepliesShown(false)
          setCurrentPost('')
        }}
      >
          <View style={styles.replyContainer}>
        <Image source={{uri : pfp}} style={{height: 40, width: 40 , borderRadius: 20, margin: 10,}} />
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.username}>{name}</Text>
        <TextInput 
        style={styles.replyInput}
        placeholder="Write an Answer "
        onChangeText={(text) => setNewReply(text)}
        multiline={true}
        value={reply === '' ? null : reply}
        maxLength={1000}
        />
        </View>
        <TouchableOpacity onPress={handleReply} style={styles.handleReply} >
          <Image style={{height: 20,width:20}}
          source={require('../images/send.png')}  />
        </TouchableOpacity>
        </View>


        <BottomSheetFlatList
          data={replies}
          keyExtractor={item => item.$id}
          renderItem={({item}) => (<RenderReplies {...item} />)}
          contentContainerStyle={styles.contentContainer}
        />
        
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%'
    
  },
  contentContainer: {
    backgroundColor: "white",
  },
  
  replyContainer:{
    flexDirection: 'row',
    width: '97%',
   
    backgroundColor: 'rgb(234, 255, 252)',
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 3, 
    margin: 5,
    borderRadius: 15,
    borderWidth: 0.1,
  },
  username:{
    fontSize: 20,
    marginHorizontal: 20
  },
  handleReply:{
    flex: 1,
    position: 'absolute',
    flexDirection: 'row-reverse',
    margin: 20,
    top: 0,
    right: 0,
  },
  replyInput:{
    width: '85%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '80%',
    minHeight:40,
    marginHorizontal: 10,
  }
});

export default Reply;