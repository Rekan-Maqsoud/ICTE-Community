import { use } from "react";
import { Alert, Platform } from "react-native";
import { Account, Client, Databases, ID, Query, Storage } from "react-native-appwrite";
const database_id = process.env.EXPO_PUBLIC_DB_ID;
const profile = process.env.EXPO_PUBLIC_DB_PROFILE_ID;
const postRef = process.env.EXPO_PUBLIC_DB_POSTS_ID;
const repliesRef = process.env.EXPO_PUBLIC_DB_REPLIES_ID;
const postStorage = process.env.EXPO_PUBLIC_STORAGE_POSTS;
const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)

if(Platform.OS == 'android')
    client.setPlatform('com.rekan.icte')
else if (Platform.OS == 'ios')
    client.setPlatform('com.rekan.icte')

const database = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

export const createNewAccount = async(email,password, name) =>{
    await account.create(ID.unique(),email,password,name);
    await database.createDocument(database_id,profile,ID.unique(),{
        name: name,
        email: email,
        password: password,
    })
}
export const logIn = async(email , password) => {
    try {
    const response = await account.createEmailPasswordSession(email , password)
    const userID = await account.get();
    return {user: userID, state: response}
    }catch(error){
    Alert.alert(`${error}`);}
}
export const logout = async ()=>{
    try{
    await account.deleteSession('current')
        }
        catch(error){
    Alert.alert(`${error}`);}
}
export const CheckLoginStates = async( ) => {
    try{
    const response = await account.getSession('current');
    if(response){
    const userID = await account.get();
    return userID
    }}
    catch(error){
        return false;
    }
 
}

export const getPosts = async () => {
    const {documents , total} = await database.listDocuments(database_id, postRef,[Query.orderDesc('$createdAt'),Query.select(['$createdAt', '$id', '$updatedAt', 'imageId','postImage','postParagraph','userId','username']) ])
    if(documents)
        return documents;
}

export const uploadedURL = async (asset) => {
    try{
    const response = await storage.createFile(
        postStorage, ID.unique(),await nativeImageAsset(asset)
    )
    const fileUrl = storage.getFileView(
    postStorage, 
    response.$id
    );
    return {URL:fileUrl , imageId: response.$id};
    }
    catch(error){
        Alert.alert(error)
    return {URL:null , imageId: null};
}
}
 const nativeImageAsset = async(asset) => {
    try{
    const url = new URL(asset.uri)
    return {
        name: url.pathname.split("/").pop(),
        size: asset.fileSize,
        type: asset.mimeType,
        uri: url.href,
    }
    }catch(error){
        console.error(error)
    }
}
export const newPost = async(userId ,username, text,image , imageId) => {
    try{
    const post =  await database.createDocument(
        database_id,postRef,ID.unique(),{
            userId: userId,
            username: username,
            postParagraph: text,
            postImage: image,
            imageId: imageId,
        }
    )}
    catch(error){
        Alert.alert(error)
    }
}

export const deletePost = async(postId, imageId)=> {
    await database.deleteDocument(database_id,postRef,postId);
    if(imageId)
    await storage.deleteFile(postStorage,imageId);

}

export const newReply = async(userId , reply , posts)=>{
    await database.createDocument(database_id,repliesRef,ID.unique(),{posts: posts ,userId: userId,Reply: reply})
}

export const getReplies = async(postId)=>{
    try{
    const result = await database.listDocuments(database_id,repliesRef,
        [
            Query.equal('posts', postId), 
            Query.select(['Reply', 'userId', '$id']), 
            Query.limit(500),
            Query.orderDesc()
        ])
    return result}
    catch(error){
        console.log(error)
    }
}