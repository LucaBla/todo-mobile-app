import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Button, View, ActivityIndicator, Text, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Feather } from '@expo/vector-icons'; 
import {Context} from '../App'
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';
import Modal from 'react-native-modal';

const ParticipantsModal = ({}) => {

  // useEffect(() => {
  //   if(isCreating){
  //     clearStates()
  //     getFriends();
  //   }
  // }, [isCreating]);

  return(
      <Modal transparent={true} 
             //isVisible={isCreating} 
             isVisible={true} 
             backdropColor={'rgba(27, 30, 35, 0.8)'} 
             //onBackdropPress={()=>setCreating(!isCreating)}
      >
        <View style={styles.modal}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText}>Participants</Text>
          </View>
          <View style={styles.participantsWrapper}>
            <FlatList
              style={styles.participantsList}
              //data ={participants}
              renderItem={({item}) => <View>
                <Text>{item.email}</Text>
              </View>}
              scrollEnabled={true}
            />
          </View>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
  modal:{
    backgroundColor: "#383D44",
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    marginTop: Constants.statusBarHeight + 0 || 0,
    padding: 0,
  },
  headerWrapper:{
    backgroundColor: '#262A30',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText:{
    color: 'white',
    fontSize: 20,
  },
  participantsWrapper:{

  },
  text:{
    color: 'white',
  }
});

export default ParticipantsModal;