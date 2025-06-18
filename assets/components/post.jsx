import { AuthContext } from '../../app/AuthContext';
import React, { useContext, useState , useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Modal, Share, Alert } from 'react-native'
import { deletePost, getProfile } from '../appwritedb';


const Post = ({$id, userId, username  , postImage, postParagraph , imageId , $createdAt , $updatedAt}) => {
  const {CurrentUser, setLoading , setRepliesShown, setCurrentPost} = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showFull, setShowFull] = useState(false)
  const [textShown, setTextShown] = useState(false)
  const [userPFP, setUserPFP] = useState('');

  useEffect(()=>{getpfp()},[])
  const getpfp = async ()=>{
    const pfp =  await getProfile(userId)
    setUserPFP(pfp)
  }
  

  const onTextLayout = useCallback(e => {
    setTextShown(e.nativeEvent.lines.length > 3)
  }, [])
  const handleDeletePost = async() => {
    setLoading(true)
    if (CurrentUser.$id === userId)
      await deletePost($id, imageId || null)
    setLoading(false)
  }

  function timeAgo(dateString) {
    let update = '';
    let date = dateString;
    if(dateString != $updatedAt){
      update = 'Edited';
      date = $updatedAt ; 

    }
  const now = new Date();
  const postDate = new Date(date);
  const diff = Math.floor((now - postDate) / 1000);

  if (diff < 60) return `${update} ${diff}s ago`;
  if (diff < 3600) return `${update} ${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${update} ${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${update} ${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${update} ${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}
  const handleShare = async () => {
    try {
      await Share.share({
        message: postParagraph + (postImage ? `\n${postImage}` : ''),
      });
    } catch (error) {
      Alert.alert(error)
    }
  };
  return (
  <>
    <Pressable style={style.options} onPress={() => setMenuVisible(true)}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>...</Text>
      </Pressable>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={style.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={style.menuModal}>
            <Pressable style={style.menuItem} onPress={() => { setMenuVisible(false); /* Not Interested logic */ }}>
              <Text>Not Interested</Text>
            </Pressable>
            {CurrentUser.$id === userId && (
              <Pressable style={style.menuItem} onPress={() => { setMenuVisible(false); handleDeletePost(); }}>
                <Text style={{color: 'red'}}>Delete Post</Text>
              </Pressable>
            )}
            <Pressable style={style.menuItem} onPress={() => { setMenuVisible(false);}}>
              <Text>Info</Text>
            </Pressable>
            
          </View>
        </Pressable>
      </Modal>
    <View style={style.postCard}>
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: userPFP}} style={style.pfpStyle}/> 
        <Text style={style.username}> {username} </Text>
        <Text style={{fontSize: 10,color: 'rgba(31,31,31,0.7)',padding:8}}>{timeAgo($createdAt)} </Text>
      </View>
      <View>
        <Text style={style.postText}
        numberOfLines={showFull ? undefined : 3}
        onTextLayout={onTextLayout}
        > {postParagraph} </Text>

        { textShown && !showFull && 
        (<TouchableOpacity onPress={() => setShowFull(true)}>
          <Text style={style.seeOptions}>see more</Text>
        </TouchableOpacity>)}

        { textShown && showFull && 
        (<TouchableOpacity onPress={() => setShowFull(false)}>
          <Text style={style.seeOptions}>see less</Text>
        </TouchableOpacity>)}

        {postImage  &&
        (<Image style={style.postImageStyle} 
          source={{ uri: postImage}} />)}
      </View>
      <View style={style.interact}>
        <TouchableOpacity 
        style={style.interactButton}
        onPress={() => {
          setRepliesShown(true)
          setCurrentPost($id)
          }}>
          <Image style={style.interactIcons}source={require('../images/reply.png')}/>
          <Text>Reply</Text>
          </TouchableOpacity>
        <TouchableOpacity 
        onPress={handleShare} 
        style={style.interactButton}>
          <Image style={style.interactIcons} source={require('../images/share.png')}/>
          <Text>Share</Text>
          </TouchableOpacity>
      </View>      
    </View>
   </>
  )
}

export default Post

const style = StyleSheet.create ({
    pfpStyle: {
        height: 40,
        width: 40,
        marginHorizontal: 10,
        borderRadius: 20,
    },
    postCard:{
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 8,
        borderRadius: 15,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: {width: 0,height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postText: {
        padding:10,
        fontSize: 16,
        color: '#313131',
    },
    seeOptions:{
      margin: 10,
      color: '#313199'
    },
    
    postImageStyle:{
        resizeMode: 'center',
        marginBottom: 10,
        height:400,
        width: '100%',
    },username: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#414141',
    },
    options:{
    position: 'absolute',
    right: '8%',
    top: 5,
    zIndex: 10,
    padding: 8,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(88, 88, 88, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 180,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  interact:{
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  interactButton:{
    flexDirection: 'row',
    paddingVertical: 6,
    paddingRight: 20,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 0.1,
    backgroundColor: 'rgba(159, 159, 159, 0.05)',
    shadowColor: '#000',
  },
  interactIcons:{
    height: 20,
    width: 20,
    marginRight: 10,
  },
})