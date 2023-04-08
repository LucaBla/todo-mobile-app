import React, {useContext, useRef, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, SafeAreaView, Keyboard, ActivityIndicator} from 'react-native';
import {Context} from '../App'
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';
import { handleDeleteFriendshipNotification, handleAcceptFriendshipNotification } from '../api';

export default function FriendshipNotification({navigation, email, friendshipId, removeItem}) {

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const swipeableRef = useRef(null);

  const closeSwipeable = () => {
    if (this.swipeableRef !== null) {
      swipeableRef.current.close();
    }
  };

  function handleSwipe(direction){
    if(direction === "right"){
      handleDeleteFriendshipNotification(removeItem, friendshipId, authToken);
    }
    else if(direction === "left"){
      handleAcceptFriendshipNotification(removeItem, friendshipId, authToken);
    }
  }

  const renderLeftActions = () => {
    return (
      <View style={styles.acceptAction}>
        <Feather name="check" size={24} color="white" />
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View style={styles.deleteAction}>
        <Feather name="x" size={24} color="white" />
      </View>
    );
  };

  return (
    <Swipeable overshootLeft={false}
               ref={swipeableRef}
               overshootFriction={8}
               renderLeftActions={renderLeftActions}
               renderRightActions={renderRightActions} 
               onSwipeableOpen={handleSwipe}
    >
      <View style={styles.friendshipNotificationWrapper}>
        <Text style={styles.friendRequestHeader}>Friend Request:</Text>
        <Text style ={styles.emailText}>{email}</Text>
      </View>
    </Swipeable>
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
  },
  friendshipNotificationWrapper: {
    backgroundColor: '#262A30',
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  friendRequestHeader:{
    color: 'white',
    fontSize: 18,
    flexShrink: 1
  },
  text:{
    color: 'white',
    fontSize: 16,
    flexShrink: 1
  },
  emailText:{
    color: '#F17300',
    fontSize: 16,
    flexShrink: 1
  },
  deleteAction:{
    backgroundColor: "red",
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row-reverse",
    borderRadius: 10,
  },
  acceptAction:{
    backgroundColor: "#81A4CD",
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
  }
});