import { useCallback, useEffect, useState } from 'react'
import {  StyleSheet, Text , View, Image, TouchableOpacity} from 'react-native'
import { getProfile } from '../appwritedb'
import { useFocusEffect } from 'expo-router'

const RenderReplies = ({userId , Reply}) => {
    const [name , setName ]= useState('')
    const [pfp , setPFP] = useState('https://fra.cloud.appwrite.io/v1/storage/buckets/6846be5400304cffc4b4/files/684da7c800163fdc3999/view?project=6846aab500310c73bd23&mode=admin')

    const [showFull, setShowFull] = useState(false)
    const [textShown, setTextShown] = useState(false)

    useFocusEffect(useCallback(() => {setup()}, [userId]))
    const setup = async ()=>{
      const documents = await getProfile(userId)
      setName(documents.name)
      setPFP(documents.pfp)
    }

    const onTextLayout = useCallback(e => {
        setTextShown(e.nativeEvent.lines.length > 3)
      }, [])
      
  return (
    
    <>
      <View style={styles.container}>
        <Image source={{uri : pfp}} style={{height: 45, width: 45 , borderRadius: 20, margin: 10,}}/>
        <View style={{flexDirection: 'column'}}>
        <Text style={{fontWeight: 'semibold',fontSize: 15,color: 'black'}}>{name}</Text>
        <Text style={{color: '#414141', maxWidth: '91%', fontSize: 14}} 
        numberOfLines={showFull ? undefined : 3}
        onTextLayout={onTextLayout}
        >{Reply}</Text>
        { textShown && !showFull && 
                (<TouchableOpacity onPress={() => setShowFull(true)}>
                  <Text style={styles.seeOptions}>see more</Text>
                </TouchableOpacity>)}
        
                { textShown && showFull && 
                (<TouchableOpacity onPress={() => setShowFull(false)}>
                  <Text style={styles.seeOptions}>see less</Text>
                </TouchableOpacity>)}
        </View>
      </View>   
      </>
  )
}

export default RenderReplies

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    resizeMode: 'contain',
    maxWidth: '98%',
    borderRadius: 10,
    marginVertical: 3,
    marginHorizontal: 3,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 3,
    minHeight: 70
  },
  seeOptions:{
      margin: 10,
      color: '#313199'
    },

})