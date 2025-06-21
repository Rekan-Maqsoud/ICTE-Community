import  React , {  useCallback, useContext, useState , useEffect } from 'react'
import { FlatList ,BackHandler, Alert ,Pressable,StyleSheet} from 'react-native'
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import Post from '../../assets/components/post'
import { getPosts} from '../../assets/appwritedb'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'
import Reply from '../../assets/components/reply'

const Home = () => {
  const {loading} = useContext(AuthContext)
  const [post , setPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false)
  const [fullImage , setFullImage] =useState(false);
  const [fullImageUrl, setFullImageUrl] = useState('');


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

 useEffect(() => {
  const onBackPress = () => {
    if (fullImage) {
      setFullImage(false);
      setFullImageUrl('');
      return true; 
    }
    Alert.alert(
      'Exit App',
      'Are you sure you want to close the app?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => null },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
    return true; 
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

  return () => backHandler.remove();
}, [fullImage]);
  return (
    <>
      <FlatList 
      data={post || []}
      keyExtractor={item => item.$id}
      renderItem={({item}) => (<Post {...item} setFullImage={setFullImage} setFullImageUrl={setFullImageUrl}
      />)}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{ paddingBottom: 200 }}
      />
      <Reply />

      {fullImage && 
      <Pressable style={styles.FullImage} onPress={
        () => {
          setFullImage(false)
          setFullImageUrl('')
        }
        }>
        <ImageZoom
          uri={fullImageUrl}
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