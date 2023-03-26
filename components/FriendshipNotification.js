import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, SafeAreaView, Keyboard, ActivityIndicator} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';

export default function FriendshipNotification({navigation, email}) {

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  // const getFriends = async () =>{
  //   try{
  //     const response = await fetch ("http://192.168.178.152:3000/api/v1/friendships", {
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": authToken,
  //       }
  //     })
  //     const json = await response.json();
  //     console.log(json);

  //     setFriends(json)
  //   } catch (error) {
  //     console.error(error);
  //   } finally{
  //     setLoading(false);
  //   }
  // }

  // const postFriendships = async () =>{
  //   const friendshipData = {
  //     friendship:{
  //       friend_email: email,
  //     }
  //   }

  //   try{
  //     const response = await fetch ("http://192.168.178.152:3000/api/v1/friendships", {
  //       method: "post",
  //       headers: {
  //         "Authorization": authToken,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(friendshipData),
  //     })
  //     //const json = await response.json();

  //   }catch(error){
  //     console.error(error);
  //   } finally{
  //     setEmail('')
  //   }
  // }

  return (
    <View>
      <Text>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23',
    paddingTop: Constants.statusBarHeight + 0 || 0,
  },
  header:{
    color: 'white',
    fontSize: 25,
  },
  topBar:{
    direction: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#14161A',
    position: 'static',
    width: '95%',
    height: 50,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  backButton:{
    paddingRight: 10,
  },
  scrollView:{
    marginTop: 10,
  },
  notificationlistWrapper:{
    marginTop: 20,
  }
});