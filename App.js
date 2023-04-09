import React, {useState, createContext, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TodoList from './components/TodoList';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Friends from './components/Friends';
import Notifications from './components/Notifications';
import ForgotPassword from './components/ForgotPassword';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings';
import { validateToken } from './api';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export const Context = createContext(null);

export default function App() {
  const [authToken, setAuthToken] = useState(null);
  const [isValidAuthToken, setIsValidAuthToken] = useState(false);

  const getToken = async () =>{
    try {
      //const token = await SecureStore.getItemAsync('authToken');
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Verwenden Sie den JWT-Token für API-Anforderungen
        console.log('token found');
        setAuthToken(token);
      }
      else{
        console.log('no Token found');
        setAuthToken(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    validateToken(authToken, setIsValidAuthToken);
  }, [authToken]);

  return (
    <RootSiblingParent> 
      <Context.Provider value={{authToken, setAuthToken}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isValidAuthToken ? (
              <>
                <Stack.Screen
                  name="TodoList"
                  component={TodoList}
                />
                <Stack.Screen
                  name="Friends"
                  component={Friends}
                />
                <Stack.Screen
                  name="Notifications"
                  component={Notifications}
                />
              </>
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
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
              </>
            )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </Context.Provider>
    </RootSiblingParent> 
  );
}

