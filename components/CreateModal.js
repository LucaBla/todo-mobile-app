import React, {useContext, useState} from 'react';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Button, View, ActivityIndicator, Text, TextInput, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker'
import { Feather } from '@expo/vector-icons'; 
import {Context} from '../App'

const handleModalBGPress = (isCreating, setCreating) => () => {
  setCreating(!isCreating);
}

const handleAnyTimePress = (isAnytime, setIsAnytime) => () =>{
  console.log("T3est");
  setIsAnytime(!isAnytime)
}

const CreateModal = ({isCreating, setCreating, getTodos}) => {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [deadline, setDeadline] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnytime, setIsAnytime] = useState(false);

  const postTodo = async () =>{
    const todoData = {
      todo_task:{
        title: title,
        deadline: deadline,
        description: description,
        finished: false,
        isAnytime: isAnytime,
      }
    }

    try{
      const response = await fetch("http://192.168.178.152:3000/api/v1/todo_tasks", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify(todoData),
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status} - ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
  
      getTodos();
      setCreating(false);
    } catch(error){
      console.error(error);
    }
  }

  return(
    <Pressable onPress={handleModalBGPress(isCreating, setCreating)} style={styles.createTodoModalBGPressable}>
          <View style={styles.createTodoModalBG}>
            <Pressable>
              <View style={styles.createTodoModal}>
                <View style={styles.titleWrapper}>
                  <TextInput style={styles.inputTitle} 
                             placeholder='New Todo...' placeholderTextColor="rgba(255, 255, 255, 0.5)"
                             onChangeText={setTitle}
                             value={title}
                             />
                </View>
                <ScrollView style={styles.descriptionWrapper}>
                  <TextInput style={styles.input} 
                            multiline
                            textAlignVertical="top"
                            placeholder='Description...' placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            onChangeText={setDescription}
                            value={description}
                            />
                </ScrollView>
                <View style={styles.saveButtonWrapper}>
                  <View style={styles.selectDateWrapper}>
                    <View style={styles.anytimeWrapper}>
                      <Pressable style={styles.anytimePressable} 
                                 onPress={handleAnyTimePress(isAnytime, setIsAnytime)}>
                        <Text style={styles.anytimeText}>
                          Anytime?
                        </Text>
                        <View style={styles.anytimeButton}>
                          {isAnytime? (
                            <Feather name="check" size={24} color="#81A4CD" />
                          ): (
                            <Feather name="x" size={24} color="red" />
                          )
                          }
                        </View>
                      </Pressable>
                    </View>
                    <Button style={styles.datePickerButton} 
                            title="Select deadline" 
                            color="#F17300"
                            disabled={isAnytime}
                            onPress={() => setOpen(true)}>
                        <Text>Test</Text>
                    </Button>
                    <DatePicker
                      modal
                      mode='date'
                      open={open}
                      date={deadline}
                      minimumDate={new Date()}
                      onConfirm={(date) => {
                        setOpen(false)
                        setDeadline(date)
                      }}
                      onCancel={() => {
                        setOpen(false)
                      }}
                    />
                  </View>
                  <Pressable style={styles.saveButton} onPress={postTodo}>
                    <View>
                      <Feather name="save" size={24} color='rgba(255, 255, 255, 0.5)' />
                    </View>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  createTodoModalBGPressable:{
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
    marginTop: Constants.statusBarHeight || 0,
    width: "100%",
    height: "100%",
  },
  createTodoModalBG:{
    backgroundColor: 'rgba(27, 30, 35, 0.8)',
    position: "absolute",
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  createTodoModal:{
    backgroundColor: "#383D44",
    height: "65%",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  titleWrapper:{
    backgroundColor:"#262A30",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 0,
  },
  inputTitle:{
    color: "white",
    fontSize: 20,
    padding: 15
  },
  input:{
    color: "white",
    fontSize: 18,
    padding: 15,
    paddingTop: 15
  },
  descriptionWrapper:{
    padding: 0,
  },
  selectDateWrapper:{
  },
  anytimeWrapper:{
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  anytimeText:{
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 18
  },
  anytimePressable:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  anytimeButton:{
    backgroundColor: "#383D44",
    width: 25,
    height: 25,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#262A30",
    padding: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  datePickerButton:{
    color: 'rgba(255, 255, 255, 0.5)',
  },
  saveButton:{
    position: "relative",
    padding: 10,
  }
});

export default CreateModal;