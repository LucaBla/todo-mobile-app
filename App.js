import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.text}>{title}</Text>
  </View>
)

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTodos = async () =>{
    try {
      const response = await fetch("http://192.168.178.152:3000/api/v1/todo_tasks");
      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <View style={styles.container}>
    {isLoading? (
      <ActivityIndicator/>
    ):(
      <FlatList data={data} renderItem={({item}) => <Item title={item.title}/>}/>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23',
    paddingTop: Constants.statusBarHeight || 0,
  },
  item:{
    backgroundColor: "#262A30",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10
  },
  text:{
    color: 'white'
  }
});
