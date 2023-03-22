import React, {useEffect, useState} from 'react';
import Constants from 'expo-constants';
import { FlatList, StyleSheet, Button, View, ActivityIndicator, Text, Pressable, SectionList } from 'react-native';
import Todo from "./components/Todo";
import CreateModal from "./components/CreateModal";
import SectionHeader from './components/SectionHeader';
import { Feather } from '@expo/vector-icons'; 
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import ListPlaceholder from './components/ListPlaceholder';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [isCreating, setCreating] = useState(false);
  const [data, setData] = useState([]);

  // const getTodos = async () =>{
  //   try {
  //     const response = await fetch("http://192.168.178.152:3000/api/v1/todo_tasks");
  //     const json = await response.json();

  //     setData(json);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const getTodos = async () =>{
    try {
      const response = await fetch("http://192.168.178.152:3000/api/v1/todo_tasks");
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

  const handleAddButtonPress = () =>{
    setCreating(!isCreating);
  }

  const removeItem = (itemToRemoveID) =>{
    // let remainingItems = data.filter((item) => {
    //   return item.id !== itemToRemoveID
    // })
    let newData = [...data]
    for(let i = 0; i < data.length; i++){
      let remainingItems = data[i].data.filter((item) => {
        return item.id !== itemToRemoveID
      })
      console.log(newData[i].data);
      
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
  }, []);

  return (
    <View style={styles.container}>
    {isCreating?(
      <CreateModal isCreating={isCreating} setCreating={setCreating} getTodos={getTodos}/>
    ) : (
      <View></View>
    )
    }
    {isLoading? (
      <ActivityIndicator/>
    ):(
      <SectionList
        initialNumToRender={12}
        refreshing={false}
        onRefresh={getTodos}
        style={styles.list}
        stickySectionHeadersEnabled={true}
        sections={data}
        renderItem={({item}) => <Todo id={item.id} 
                                      title={item.title} 
                                      finished={item.finished}
                                      deadline={item.deadline} 
                                      description={item.description}
                                      getTodos={getTodos}
                                      removeItem={removeItem}
                                      />}
        ListEmptyComponent={<ListPlaceholder/>}
        renderSectionHeader={({section}) => <SectionHeader title={section.title}/>}
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
    paddingTop: Constants.statusBarHeight || 0,
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
  addButtonText:{
    color: 'white',
    fontSize: 30
  },
  list:{
    marginBottom: 30,
  }
});
