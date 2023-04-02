import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, SafeAreaView, Keyboard, ActivityIndicator} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { FlatList } from 'react-native-gesture-handler';
import Friend from './Friend';
import Toast from 'react-native-root-toast';

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
          "Content-Type": "application/json",
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

  const postFriendships = async () =>{
    const friendshipData = {
      friendship:{
        friend_email: email,
      }
    }

    try{
      const response = await fetch ("http://192.168.178.152:3000/api/v1/friendships", {
        method: "post",
        headers: {
          "Authorization": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(friendshipData),
      })
      
      let toast = Toast.show('Send friend request if user exists.', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP  + 80
      });

    }catch(error){
      console.error(error);
    } finally{
      setEmail('')
    }
  }

  const handleGoBack = () =>{
    navigation.goBack();
  }

  const removeItem = (itemToRemoveID) =>{
    let newFriends = [...friends]
    let remainingItems = newFriends.filter((item) => {
      return item.id !== itemToRemoveID
    })

    setFriends(remainingItems);
  }

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Feather name="chevron-left" size={25} color="white" />
          </Pressable>
          <Text style={styles.header}>Friends</Text>
        </View>
      <ScrollView 
      style={styles.scrollView}
      stickyHeaderIndices={[0, 2]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Add new Friend</Text>
          <View style={styles.borderBottom}/>
        </View>
        <View style={styles.addFriendSection}>
          <TextInput 
            placeholder='Friends E-Mail'
            placeholderTextColor={'rgba(255,255,255, 0.5)'}
            style={styles.emailInput}
            onChangeText={setEmail}
            value={email}
            inputMode={'email'}
          />
          <Pressable style={styles.addFriendButton} onPress={postFriendships}>
            <Text style={styles.addFriendButtonText}>Add Friend</Text>
          </Pressable>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Friendlist</Text>
          <View style={styles.borderBottom}/>
        </View>
        <View style={styles.friendlistSection}>
            {isLoading? (
              <ActivityIndicator size='large' color='#ffffff'/>
            ) : (
              <FlatList
                style={styles.friendlist}
                data ={friends}
                renderItem={({item}) => <Friend 
                                          friendId={item.id} 
                                          email={item.email} 
                                          removeItem={removeItem}
                                          addable={false}
                                          />}
                scrollEnabled={false}
              />
            )
            }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23',
  },
  topBar:{
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14161A',
    width: '95%',
    position: 'static',
    paddingHorizontal: 20,
    alignSelf: 'center',
    height: 50,
    borderRadius: 10,
  },
  backButton:{
    paddingRight: 10,
  },
  header:{
    color: 'white',
    fontSize: 25,
  },
  scrollView:{
    marginTop: 10,
  },
  sectionHeader:{
    backgroundColor: '#1B1E23',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sectionHeaderText:{
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  borderBottom:{
    borderBottomColor: '#262A30',
    borderBottomWidth: 3,
    width: '100%',
    alignSelf: 'center',
  },
  addFriendSection:{
    marginTop: 10,
    marginBottom: 40,
  },
  emailInput:{
    width: '80%',
    backgroundColor: '#383D44',
    fontSize: 20,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 10,
    alignSelf: 'center',
  },
  addFriendButton:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: '#F17300',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  addFriendButtonText:{
    fontSize: 18,
    color: 'white'
  },
  friendlistSection:{
    marginTop: 0,
    flex: 1,
    flexGrow: 1,
  },
  friendlist:{
    marginBottom: 80,
  },
})