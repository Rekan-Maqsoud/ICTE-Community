import  React , {  useCallback, useContext, useState } from 'react'
import { FlatList ,Image,Pressable,StyleSheet,Text, TouchableWithoutFeedback, View} from 'react-native'
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import Post from '../../assets/components/post'
import { getPosts} from '../../assets/appwritedb'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'
import Reply from '../../assets/components/reply'

const Home = () => {
  const {loading, setCurrentPost , currentPost} = useContext(AuthContext)
  const [post , setPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false)
  const [fullImage , setFullImage] =useState(false);


  const fetchPosts = async () => {
  const posts = await getPosts()
    setPost(posts)
  }
  useFocusEffect(useCallback(() => {fetchPosts()}, [loading]))
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchPosts()
    setRefreshing(false)
  }
 
  return (
    <>
      <FlatList 
      data={post || []}
      keyExtractor={item => item.$id}
      renderItem={({item}) => (<Post {...item} setFullImage={setFullImage}
      />)}
      refreshing={refreshing}
       onRefresh={onRefresh}
      />
      <Reply />

      {fullImage && 
      <Pressable style={styles.FullImage} onPress={
        () => {
          setFullImage(false)
          setCurrentPost('')
        }
        }>
        <ImageZoom
          uri={currentPost}
          minScale={1}
          maxScale={5}
          doubleTapScale={3}
          style={styles.image}
        />
      </Pressable>
    
    }
    </>
  )
}

export default Home

const styles = StyleSheet.create ({
   FullImage:{
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '100%',
    width: '100%',
  },
  image: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  }
})