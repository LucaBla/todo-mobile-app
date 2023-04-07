import React, {useContext, useState, useCallback, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, ScrollView, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard, Dimensions} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';

export default function LogIn({navigation}) {
  const [fontsLoaded] = useFonts({
    'Exo': require('../assets/fonts/Exo-Medium.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const handleForgotPasswordNavigation =  () => {
    navigation.navigate('ForgotPassword');
  }

  const postLogIn = async () =>{
    const logInData = {
      todo_user:{
        email: email,
        password: password,
      }
    }

    try{
      const response = await fetch("http://192.168.178.152:3000/todo_users/sign_in", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logInData),
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status} - ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response;
      const newAuthToken = data.headers.get('Authorization');

      console.log(newAuthToken);

      saveAuthToken(newAuthToken);
      setAuthToken(newAuthToken);

      let toast = Toast.show('Logged In.', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP  + 80
      });
    } catch(error){
      console.error(error);
      let toast = Toast.show('Login Failed.', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP  + 80
      });
    }
  }

  const saveAuthToken = async (newAuthToken) =>{
    try {
      await SecureStore.setItemAsync('authToken', newAuthToken);
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   saveAuthToken();
  // }, [authToken]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const onContentSizeChange = (contentWidth, contentHeight) => {
    console.log("Moin");
    console.log(contentHeight);
    console.log(Constants.statusBarHeight);
    console.log(Dimensions.get('window').height);
    if (contentHeight > Dimensions.get('window').height) {
      setIsScrollable(true);
    } else {
      setIsScrollable(false);
    }
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={Keyboard.dismiss}
      onLayout={onLayoutRootView}
    >
      <View style={styles.container}>
      <ScrollView 
          style={styles.scrollView}
          scrollEnabled={isScrollable}
          onContentSizeChange={onContentSizeChange}
        >
        <View style={styles.scrollContent}>
        <View style={styles.logInWrapper}>
          <Text style={styles.header}>
            Daily<Text style={styles.coloredHeader}>Drill</Text>
          </Text>
          <View style={styles.textInputWrapper}>
            <Feather name="mail" size={20} color="rgba(255,255,255, 0.5)" />
            <TextInput 
              style={styles.textInput} 
              placeholder='E-Mail' 
              placeholderTextColor='rgba(255,255,255, 0.5)'
              onChangeText={setEmail}
              value={email}
              inputMode={'email'}
              />
          </View>
          <View style={styles.textInputWrapper}>
            <Feather name="lock" size={20} color="rgba(255,255,255, 0.5)" />
            <TextInput 
              style={styles.textInput} 
              secureTextEntry={true}
              placeholder='Password' 
              placeholderTextColor='rgba(255,255,255, 0.5)'
              onChangeText={setPassword}
              value={password} />
          </View>
          <Pressable style={styles.logInButton} onPress={postLogIn}>
            <Text style={styles.logInButtonText}>Login</Text>
          </Pressable>
          <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.logInButtonText}>Signup</Text>
          </Pressable>
          <Pressable onPress={handleForgotPasswordNavigation}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>
        </View>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B1E23',
    paddingTop: Constants.statusBarHeight + 20 || 0,
  },
  scrollView:{
    height: '100%',
    width: '100%',
  },
  scrollContent:{
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInWrapper:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '110%',
  },
  header:{
    color: 'white',
    fontSize: 40,
    marginBottom: 40,
    fontFamily: 'Exo',
  },
  coloredHeader: {
    color: '#F17300',
  },
  textInputWrapper:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#383D44',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20
  },
  textInput:{
    color: 'white',
    width: '100%',
    marginLeft: 10,
    fontSize: 20,
  },
  logInButton:{
    backgroundColor: '#F17300',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  logInButtonText:{
    color: 'white',
    fontSize: 20,
  },
  forgotPasswordText:{
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  signUpButton:{
    backgroundColor: '#262A30',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 40
  },
})