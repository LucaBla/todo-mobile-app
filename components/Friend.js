import React, {useContext, useState} from 'react';
import Constants from 'expo-constants';
import {View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';

export default function Friend({email, removeItem, friendId}) {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const handleDelete = async () => {
    const friendIdData = {
      friendship:{
        friend_id: friendId,
      }
    }

    try{
      removeItem(friendId);
      const response = await fetch(`http://192.168.178.152:3000/api/v1/friendships`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify(friendIdData)
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status} - ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      
    }
    catch(error){
      console.error(error);
    }
  };

  const renderRightActions = () => {
    return (
      <View
     style={styles.deleteAction}>
     <Text
       style={{
         color: 'white',
         paddingHorizontal: 10,
         fontWeight: '600'
       }}>
       <Feather name="user-x" size={24} color="white" />
     </Text>
   </View>
    );
  };

  return (
    <Swipeable overshootLeft={false}
               overshootFriction={1}
               renderRightActions={renderRightActions} 
               onSwipeableOpen={handleDelete}
    >

      <View style={styles.friendWrapper}>
        <Text style={styles.text}>{email}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  friendWrapper: {
    backgroundColor: '#262A30',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    textAlign: "center",
    overflow: "hidden",
  },
  text:{
    color: 'white',
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
    flex: 1,
    flexDirection: "row-reverse",
    borderRadius: 10,
  },
})