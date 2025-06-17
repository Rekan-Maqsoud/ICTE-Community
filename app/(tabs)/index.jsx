import { FlatList} from 'react-native'
import  {  useCallback, useContext, useState } from 'react'
import Post from '../../assets/components/post'
import { getPosts} from '../../assets/appwritedb'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../AuthContext'
import Reply from '../../assets/components/reply'

const home = () => {
  const {loading} = useContext(AuthContext)
  const [post , setPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false)
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
      renderItem={({item}) => (<Post {...item}/>)}
      refreshing={refreshing}
       onRefresh={onRefresh}
      />
      <Reply />
    </>
  )
}

export default home