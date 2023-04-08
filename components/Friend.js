import React, {useContext, useState} from 'react';
import Constants from 'expo-constants';
import {View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import { handleDeleteFriendship } from '../api';

export default function Friend({email, removeItem, friendId, addable, participantsId, setParticipantsId}) {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [isAddable, setIsAddable] = useState(addable);

  const handleAddToParticipants = () =>{
    let newParticipantsId = [...participantsId];
    newParticipantsId.push(friendId);
    console.log(newParticipantsId);
    setParticipantsId(newParticipantsId);
  }

  const handleRemoveFromParticipants = () =>{
    setParticipantsId(participantsId.filter((participantId) => participantId !== friendId))
  }

  const renderLeftActions = () => {
    return (
      <View
        style={styles.addAction}>
      <Feather name="user-check" size={24} color="white" />
       <Text style={styles.text}>{email}</Text>
   </View>
    );
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
    <View>
      {isAddable ? (
        <Swipeable overshootLeft={false}
                  overshootFriction={1}
                  renderLeftActions={renderLeftActions} 
                  onSwipeableOpen={handleAddToParticipants}
                  onSwipeableClose={handleRemoveFromParticipants}
        >
          <View style={[styles.friendWrapper, styles.friendWrapperAdded]}>
            <Feather style={styles.userIcon} name="user" size={24} color="white" />
            <Text style={styles.text}>{email}</Text>
          </View>
        </Swipeable>
      ) : (
        <Swipeable overshootLeft={false}
                  overshootFriction={1}
                  renderRightActions={renderRightActions} 
                  onSwipeableOpen={()=>handleDeleteFriendship(friendId, removeItem, authToken)}
        >
          <View style={styles.friendWrapper}>
            <Text style={styles.text}>{email}</Text>
          </View>
        </Swipeable>
      )
      }
    </View>
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
  friendWrapperAdded:{
    gap: 10,
    padding: 10,
    marginVertical: 5,
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
  addAction:{
    backgroundColor: "#81A4CD",
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
    textAlign: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    gap: 10,
    padding: 10,
    paddingLeft: 15,
  },
  userIcon:{
    marginLeft: -3,
    marginRight: 3,
  }
})