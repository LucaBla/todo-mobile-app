import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';

export default function Friends({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState('');

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const getFriends = async () =>{
    try{
      const response = await fetch ("http://192.168.178.152:3000/api/v1/friendships", {
        method: "get",
        headers: {
          "Authorization": authToken,
        }
      })
      const json = await response.json();
      console.log(json);

      setFriends(json)
    } catch (error) {
      console.error(error);
    } finally{
      setLoading(false);
    }
  }

  const handleGoBack = () =>{
    navigation.goBack();
  }

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Feather name="chevron-left" size={25} color="white" />
        </Pressable>
          <Text style={styles.header}>Friends</Text>
        </View>
        <View style={styles.addFriendSection}>
          <Text style={styles.sectionHeader}>Add new Friend</Text>
          <View style={styles.borderBottom}/>
          <TextInput 
            placeholder='Friends E-Mail'
            placeholderTextColor={'rgba(255,255,255, 0.5)'}
            style={styles.emailInput}
          />
          <Pressable style={styles.addFriendButton}>
            <Text style={styles.addFriendButtonText}>Add Friend</Text>
          </Pressable>
        </View>
        <View style={styles.friendlistSection}>
          <Text style={styles.sectionHeader}>Friendlist</Text>
          <View style={styles.borderBottom}/>
            {isLoading? (
              <ActivityIndicator size='large' color='#ffffff'/>
            ) : (
              <FlatList
                style={styles.friendlist}
                data ={friends}
                renderItem={({item}) => <Friend email={item.email}/>}
              />
            )
            }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23',
    paddingTop: Constants.statusBarHeight + 0 || 0,
  },
  topBar:{
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262A30',
    width: '100%',
    position: 'static',
    paddingHorizontal: 20,
    height: 50,
  },
  backButton:{
    paddingRight: 10,
  },
  header:{
    color: 'white',
    fontSize: 25,
  },
  sectionHeader:{
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  borderBottom:{
    borderBottomColor: '#262A30',
    borderBottomWidth: 3,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  addFriendSection:{
    marginTop: 20,
  },
  emailInput:{
    width: '90%',
    backgroundColor: '#383D44',
    fontSize: 20,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 10,
  },
  addFriendButton:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: '#F17300',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addFriendButtonText:{
    fontSize: 18,
    color: 'white'
  },
  friendlistSection:{
    marginTop: 40,
  },
  friendlist:{
 
  },
})