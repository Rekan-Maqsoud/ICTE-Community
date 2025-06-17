import { Text , Image } from 'react-native'

const icon = ({name , imagePath}) => {
  return (
              <>
            <Image source={imagePath} 
              style={
                { maxHeight: 30 , maxWidth: 30, margin: 'auto'}
              }/>
              <Text >{name}</Text>
          </>
  )
}

export default icon