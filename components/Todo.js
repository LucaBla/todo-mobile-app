import React, {useContext, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View } from 'react-native';
import { RectButton, PanGestureHandler, Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import {Context} from '../App'
import { handleUpdateTodo, handleDeleteTodo, getTodos } from '../api';

const Todo = ({id, title, finished, deadline, description, getTodos, removeItem, isShowingParticipants,
  setIsShowingParticipants, setParticipantsTodoID, setData, setLoading}) => {
  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const [isFinished, setIsFinished] = useState(finished);
  const [isOpened, setIsOpened] = useState(false);
  const [swipeState, setSwipeState] = useState(null);

  const swipeableRef = useRef(null);

  const closeSwipeable = () => {
    if (this.swipeableRef !== null) {
      swipeableRef.current.close();
    }
  };

  function handleSwipe(direction){
    if(direction === "right"){
      handleDeleteTodo(removeItem, id, authToken);
    }
    else if(direction === "left"){
      closeSwipeable();
      setIsFinished(!isFinished);
      handleUpdateTodo(isFinished, id, authToken, setData, setLoading);
    }
  }

  const handlePress = () => {
    // Führen Sie hier die Aktion aus, um das Element aus der Liste zu entfernen
    setIsOpened(!isOpened);
  };

  const handleParticipantsPress = () =>{
    setParticipantsTodoID(id)
    setIsShowingParticipants(!isShowingParticipants)

  }

  const renderLeftActions = () => {
    return (
      <View style={styles.swipeLeftActionWrapper}>
        {isFinished?(
          <View
              style={[styles.notDoneAction, isOpened ? styles.noMarginBottom : styles.notDoneAction]}>
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600'
              }}>
              <Feather name="x" size={24} color="white" />
            </Text>
          </View>
        ):(
          <View
              style={[styles.doneAction, isOpened ? styles.noMarginBottom : styles.doneAction]}>
            <Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600'
              }}>
              <Feather name="check" size={24} color="white" />
            </Text>
          </View>
        )
        }
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View
     style={[styles.deleteAction, isOpened ? styles.noMarginBottom : styles.deleteAction]}>
     <Text
       style={{
         color: 'white',
         paddingHorizontal: 10,
         fontWeight: '600'
       }}>
       <Feather name="trash-2" size={24} color="white" />
     </Text>
   </View>
    );
  };

  return(
    <View>
    <Pressable onPress={handlePress}>
    <Swipeable overshootLeft={false}
               ref={swipeableRef}
               overshootFriction={8}
               renderLeftActions={renderLeftActions}
               renderRightActions={renderRightActions} 
               onSwipeableOpen={handleSwipe}>
        <View
          style={[styles.item, isOpened ? styles.noBorderRadius : styles.item]}
        >
          <View style={[styles.todoState, isOpened ? styles.noBorderRadius : styles.todoState]}>
            {isFinished?(
              <Feather name="check" size={24} color="#81A4CD" />
            ):(
              <Feather name="x" size={24} color="red" />
            )
            }
          </View>
          <Text style={styles.text}>{title}</Text>
          {isOpened?(
            <Pressable 
              style={styles.userIcon} 
              onPress={handleParticipantsPress}
            >
              <Feather name="users" size={24} color="rgba(255, 255, 255, 0.5)" />
            </Pressable>
          ):(
            <></>
          )

          }
        </View>
        {isOpened?(
          <View style={styles.todoInfo}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.text}>{description}</Text>
            </View>
          </View>
        ):(
          <View></View>
        )
        }
      </Swipeable>
      </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  item:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262A30",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    textAlign: "center",
    overflow: "hidden",
  },
  userIcon:{
    position: "absolute",
    right:10,
  },
  todoState:{
    backgroundColor: "#2D3137",
    margin: -10,
    marginRight: 10,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
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
  swipeLeftActionWrapper:{
    flex: 0.25,
    width: 1,
    marginRight: -10,
  },
  doneAction:{
    backgroundColor: "#81A4CD",
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center",
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    marginRight: -10,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  notDoneAction:{
    backgroundColor: "#F17300",
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center",
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    marginRight: -10,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  todoInfo:{
    display: "flex",
    backgroundColor: "#383D44",
    marginHorizontal: 10,
    marginTop: -10,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  deadlineContainer:{
    
  },
  descriptionContainer:{

  },
  text:{
    color: 'white',
    fontSize: 16,
    flexShrink: 1
  },
  noBorderRadius:{
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  noMarginBottom:{
    marginBottom:0,
  }
});

export default Todo;