import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Button, View, ActivityIndicator, Text, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Feather } from '@expo/vector-icons'; 
import {Context} from '../App'
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';
import Modal from 'react-native-modal';

const ParticipantsModal = ({isShowingParticipants, setIsShowingParticipants, participantsTodoID}) => {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [isLoading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [creator, setCreator] = useState(null);

  const getCreator = async () =>{
    try{
      const response = 
        await fetch (`http://192.168.178.152:3000/api/v1/todo_tasks/${participantsTodoID}/creator`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          }
        })
      const json = await response.json();
      console.log(json);

      setCreator(json)
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false);
    }
  }

  const getParticipants = async () =>{
    try{
      const response = 
        await fetch (`http://192.168.178.152:3000/api/v1/todo_tasks/${participantsTodoID}/participants`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          }
        })
      const json = await response.json();
      console.log(json);

      setParticipants(json)
    } catch (error) {
      console.error(error);
    } finally{
      getCreator();
    }
  }

  const combineParticipantsCreator = () =>{
    console.log(participants)
    let newParticipants = [...participants]
    newParticipants.push(creator)
    newParticipants = newParticipants.reverse()
    console.log('test')
    console.log(newParticipants);
    setParticipants(newParticipants);
  }

  const clearStates = () =>{
    setLoading(true)
    setParticipants([])
    setCreator(null)
  }

  useEffect(() => {
    if(isShowingParticipants){
      getParticipants();
    }
  }, [isShowingParticipants]);

  useEffect(() => {
    if(!participants.includes(creator)){
      combineParticipantsCreator();
    }
  }, [creator]);

  return(
      <Modal transparent={true} 
             isVisible={isShowingParticipants} 
             backdropColor={'rgba(27, 30, 35, 0.8)'} 
             onBackdropPress={()=>setIsShowingParticipants(!isShowingParticipants)}
      >
        <View style={styles.modal}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText}>Participants</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator size='large' color='#ffffff'/>
          ):(
            <View style={styles.participantsWrapper}>
              <FlatList
                style={styles.participantsList}
                data ={participants}
                renderItem={({item, index}) => <View style={styles.participant}>
                  <Text style={styles.text}>
                  {item.email}
                  <Text style={styles.creatorText}>
                    {index === 0 ? ' (Creator)' : ''}
                  </Text>
                  </Text>
                </View>}
                scrollEnabled={true}
              />
            </View>
          )
          }
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
    margin: 15,
    marginVertical: 10
  },
  participant:{
    marginVertical: 5,
  },
  text:{
    color: 'white',
    fontSize: 16
  },
  creatorText:{
    color: '#F17300',
  }
});

export default ParticipantsModal;