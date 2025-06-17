import { Stack } from 'expo-router';
const _layout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name='signIn'
    options={{headerShown: false}}/>

    <Stack.Screen name='signUp'
    options={{headerShown: false}}/>
    </Stack>
    )
}
export default _layout
