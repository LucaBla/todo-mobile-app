import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, SafeAreaView, Keyboard, ActivityIndicator} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';
import FriendshipNotification from './FriendshipNotification';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function Notifications({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const getFriendrequests = async () =>{
    try{
      const response = await fetch ("http://192.168.178.152:3000/api/v1/friendships/requests", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        }
      })
      const json = await response.json();
      console.log(json);

      setRequests(json)
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false);
    }
  }

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

  const handleGoBack = () =>{
    navigation.goBack();
  }

  const removeItem = (itemToRemoveID) =>{
    let newRequests = [...requests]
    let remainingItems = newRequests.filter((item) => {
      return item.id !== itemToRemoveID
    })

    setRequests(remainingItems);
  }

  useEffect(() => {
    getFriendrequests();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Feather name="chevron-left" size={25} color="white" />
          </Pressable>
          <Text style={styles.header}>Notifications</Text>
        </View>
        <ScrollView style={styles.notificationlistWrapper}>
            {isLoading? (
              <ActivityIndicator size='large' color='#ffffff'/>
            ) : (
              <FlatList
                style={styles.notificationList}
                data ={requests}
                renderItem={({item}) => <FriendshipNotification
                                          friendshipId={item.id} 
                                          email={item.creator_email}
                                          removeItem={removeItem}
                                          getFriendrequests={getFriendrequests}
                                        />}
                scrollEnabled={false}
              />
            )
            }
        </ScrollView>
        </GestureHandlerRootView>
    </SafeAreaView>
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
    display: 'flex',
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
    paddingTop: 10,
  },
  notificationlistWrapper:{
    paddingTop: 20,
  }
});