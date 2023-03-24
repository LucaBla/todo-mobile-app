import React, {useState, createContext} from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TodoList from './components/TodoList';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';

const Stack = createNativeStackNavigator();

export const Context = createContext(null);

export default function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Context.Provider value={{authToken, setAuthToken}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authToken !== null ? (
            <Stack.Screen
              name="TodoList"
              component={TodoList}
            />
          ) : (
            <>
              <Stack.Screen
                name="LogIn"
                component={LogIn}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
              />
            </>
          )

          }
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

