import React, {useEffect, useState, useRef, useContext} from 'react';
import Constants from 'expo-constants';
import { FlatList, StyleSheet, View, ActivityIndicator, Text, Pressable, SectionList } from 'react-native';
import Todo from "./Todo";
import CreateModal from "./CreateModal";
import SectionHeader from './SectionHeader';
import { Feather } from '@expo/vector-icons'; 
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import ListPlaceholder from './ListPlaceholder';
import { NavigationContainer } from '@react-navigation/native';
import {Context} from '../App'

export default function TodoList({navigation}) {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [isLoading, setLoading] = useState(true);
  const [isCreating, setCreating] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [data, setData] = useState([]);

  const sectionListRef = useRef(null);

  const getTodos = async () =>{
    try {
      const response = await fetch("http://192.168.178.152:3000/api/v1/todo_tasks", {
        method: "get",
        headers: {
          "Authorization": authToken,
        }
      })
      const json = await response.json();

      let newData = Object.values(json.reduce((acc, item) =>{
        if(!acc['anytime']){
          acc['anytime'] = {
            title: 'anytime',
              data: []
          }
        }
        if(item.isAnytime){
          acc['anytime'].data.push(item);
          console.log(acc['anytime'].data);
        }
        else if(!acc[item.deadline]) acc[item.deadline] = {
          title: item.deadline,
          data: []
        }
        if(!item.isAnytime){
          acc[item.deadline].data.push(item);
        }
        return acc
      }, {}))
      setData(newData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fillExpanedSections = () =>{
    const next = [...expandedSections]
    const newDate = new Date();
    next.push(newDate.getFullYear() + '-' + 0 + parseInt(newDate.getMonth()+1) + '-' + newDate.getDate());
    setExpandedSections(next);
  }

  const handleAddButtonPress = () =>{
    setCreating(!isCreating);
  }

  const handleLogOut = () =>{
    setAuthToken(null);
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

  useEffect(() => {
    getTodos();
    fillExpanedSections();
    handleScrollToItem();
  }, []);

  return (
      <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.logOutButton} onPress={handleLogOut}>
          <Feather name="log-out" size={24} color="white" />
        </Pressable>
        <Pressable onPress={handleFriendsNavigation}>
          <Feather name="users" size={24} color="white" />
        </Pressable>
        <Pressable onPress={handleNotificationsNavigation}>
          <Feather name="mail" size={24} color="white" />
        </Pressable>
      </View>
      {isCreating?(
        <CreateModal isCreating={isCreating} setCreating={setCreating} getTodos={getTodos}/>
      ) : (
        <View></View>
      )
      }
      {isLoading? (
        <ActivityIndicator size='large' color='#ffffff'/>
      ):(
        <SectionList
          ref={sectionListRef}
          initialNumToRender={12}
          refreshing={false}
          onRefresh={getTodos}
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
                                          getTodos={getTodos}
                                          removeItem={removeItem}
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
      </View>
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
    direction: 'flex',
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
  logOutButton:{
    
  },
  list:{
    marginBottom: 30,
  }
});