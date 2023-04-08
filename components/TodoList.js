import React, {useEffect, useState, useRef, useContext} from 'react';
import Constants from 'expo-constants';
import { FlatList, StyleSheet, View, ActivityIndicator, Text, Pressable, SectionList } from 'react-native';
import Todo from "./Todo";
import CreateModal from "./CreateModal";
import SectionHeader from './SectionHeader';
import { Feather } from '@expo/vector-icons'; 
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import ListPlaceholder from './ListPlaceholder';
import { useIsFocused } from '@react-navigation/native';
import {Context} from '../App'
import ParticipantsModal from './ParticipantsModal';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { getTodos, getNotificationsCount, handleLogOut } from '../api';

export default function TodoList({navigation}) {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [isLoading, setLoading] = useState(true);
  const [isCreating, setCreating] = useState(false);
  const [isShowingParticipants, setIsShowingParticipants] = useState(false);
  const [participantsTodoID, setParticipantsTodoID] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [data, setData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const isFocused = useIsFocused();

  const sectionListRef = useRef(null);

  const fillExpanedSections = () =>{
    const next = [...expandedSections]
    const newDate = new Date();
    next.push(newDate.getFullYear() + '-' + 0 + parseInt(newDate.getMonth()+1) + '-' + newDate.getDate());
    setExpandedSections(next);
  }

  const handleAddButtonPress = () =>{
    setCreating(!isCreating);
  }

  const handleFriendsNavigation = () =>{
    navigation.navigate('Friends');
  }

  const handleNotificationsNavigation = () =>{
    navigation.navigate('Notifications');
  }

  const handleExpand = (title) =>{
    console.log(title);
    setExpandedSections((expandedSections) => {
      const next = [...expandedSections];
      if (next.includes(title)) {
        next.splice(next.indexOf(title), 1);
      } else {
        next.push(title);
      }
      return next;
    });
  }

  const handleScrollToItem = () => {
    sectionListRef.current?.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: 1,
      viewOffset: 0,
      viewPosition: 0.5,
    });
  };

  const removeItem = (itemToRemoveID) =>{
    let newData = [...data]
    for(let i = 0; i < data.length; i++){
      let remainingItems = data[i].data.filter((item) => {
        return item.id !== itemToRemoveID
      })
      
      newData[i].data = remainingItems;
    }

    for(let i = 0; i < newData.length; i++){
      if(newData[i].data.length === 0){
        newData.splice(i, 1)
      }
    }

    setData(newData);
  }

  useEffect(() =>{
    if(isFocused){
      getTodos(authToken, setData, setLoading);
      getNotificationsCount(authToken, setNotificationCount);
    }
  }, [isFocused])

  useEffect(() => {
    getTodos(authToken, setData, setLoading);
    getNotificationsCount(authToken, setNotificationCount);
    fillExpanedSections();
    handleScrollToItem();
    SplashScreen.hideAsync();
  }, []);

  useEffect(() =>{
    if(!isCreating){
      getTodos(authToken, setData, setLoading);
    }
  }, [isCreating])

  return (
      <GestureHandlerRootView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.logOutButton} onPress={()=>handleLogOut(setAuthToken, authToken)}>
          <Feather name="log-out" size={24} color="white" />
        </Pressable>
        <Pressable onPress={handleFriendsNavigation}>
          <Feather name="users" size={24} color="white" />
        </Pressable>
        <Pressable onPress={handleNotificationsNavigation}>
          {notificationCount !== 0 ? (
            <View style={styles.notificationCount}>
              <Text style={styles.notificationCountText}>{notificationCount}</Text>
            </View>
          ):(
            <View></View>
          )
          }
          <Feather name="mail" size={24} color="white" />
        </Pressable>
      </View>
      <CreateModal isCreating={isCreating} setCreating={setCreating} getTodos={()=>getTodos(authToken, 
                                                                                   setData, 
                                                                                   setLoading)
                                                                              }
      />
      <ParticipantsModal
        isShowingParticipants={isShowingParticipants} 
        setIsShowingParticipants={setIsShowingParticipants}
        participantsTodoID={participantsTodoID}
        />
      {isLoading? (
        <ActivityIndicator size='large' color='#ffffff'/>
      ):(
        <SectionList
          ref={sectionListRef}
          initialNumToRender={12}
          refreshing={false}
          onRefresh={()=>getTodos(authToken, setData, setLoading)}
          style={styles.list}
          stickySectionHeadersEnabled={true}
          sections={data}
          extraData={expandedSections}
          renderItem={({section: { title }, item}) =>{  
            const isExpanded = expandedSections.includes(title);

            if (!isExpanded) return null;

            return <Todo id={item.id} 
                                          title={item.title} 
                                          finished={item.finished}
                                          deadline={item.deadline} 
                                          description={item.description}
                                          getTodos={()=>getTodos(authToken, setData, setLoading)}
                                          removeItem={removeItem}
                                          isShowingParticipants={isShowingParticipants} 
                                          setIsShowingParticipants={setIsShowingParticipants}
                                          setParticipantsTodoID={setParticipantsTodoID}
                                          setData={setData}
                                          setLoading={setLoading}
                                          />}
          } 
          renderSectionHeader={({section}) => 
            <Pressable onPress={() => handleExpand(section.title)}>
              <SectionHeader title={section.title} expandedSections={expandedSections}/>
            </Pressable>
          }
          ListEmptyComponent={<ListPlaceholder/>}
        />
      )}
      <Pressable onPress={handleAddButtonPress}>
          <View style={styles.addButton}>
            <Feather name="plus" size={45} color="white" />
          </View>
      </Pressable>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23',
    paddingTop: Constants.statusBarHeight + 0 || 0,
  },
  text:{
    color: 'white'
  },
  addButton:{
    display: 'flex',
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: "#F17300",
    borderRadius: 10
  },
  topBar:{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    backgroundColor: '#14161A',
    position: 'static',
    width: '95%',
    height: 50,
    paddingHorizontal: 20,
    gap: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  notificationCount:{
    backgroundColor: '#F17300',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 1,
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 3,
    overflow: 'visible',
    paddingHorizontal: 3,
  },
  notificationCountText:{
    color: 'white',
    fontSize: 14,
  },
  logOutButton:{
    
  },
  list:{
    marginBottom: 30,
  }
});