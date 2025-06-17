import React, { useCallback, useRef, useMemo, useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text,Image, TouchableOpacity, Alert } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { AuthContext } from "../../app/AuthContext";
import { getReplies, newReply } from "../appwritedb";
import { TextInput } from "react-native-gesture-handler";

const Reply = () => {
  const {setRepliesShown , repliesShown, currentPost, setCurrentPost, CurrentUser , loading,setLoading}= useContext(AuthContext);
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [ "75%", "100%"], []);
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
  }, [repliesShown, loading]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={{color: 'black'}}>{item.Reply}</Text>
      </View>
    ),
    []
  );
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={true}
        enablePanDownToClose
        onClose={() => {setRepliesShown(false)
          setCurrentPost('')
        }}
      >
        <BottomSheetFlatList
          data={replies}
          keyExtractor={item => item.$id}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />

        <View style={styles.replyContainer}>
        <Image source={require('../images/Profile.png')} style={{height: 50, width: 50 , borderRadius: 20, margin: 10,}} />
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.username}>username</Text>
        <TextInput 
        style={styles.replyInput}
        placeholder="Write an Answer "
        onChangeText={(text) => setNewReply(text)}
        multiline={true}
        value={reply === '' ? null : reply}
        />
        </View>

        <TouchableOpacity onPress={handleReply} style={styles.handleReply} >
          <Image style={{height: 20,width:20}}
          source={require('../images/send.png')} />
        </TouchableOpacity>

        </View>

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
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#f3f3f3",
  },
  replyContainer:{
    flexDirection: 'row',
    height: 70,
    width: '100%',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 3, 
    marginBottom: 65,
    borderRadius: 15,
    borderWidth: 0.1,
    
  },
  username:{
    fontSize: 20,
    marginHorizontal: 20
  },
  handleReply:{
    flex: 1,
    flexDirection: 'row-reverse',
    margin: 25,
  },
  replyInput:{
    flex: 5,
    width: '100%',
    height: 60,
    marginHorizontal: 40,
  }
});

export default Reply;