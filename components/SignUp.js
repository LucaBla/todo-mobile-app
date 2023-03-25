import React, {useContext, useState} from 'react';
import Constants from 'expo-constants';
import {View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';

export default function SignUp({navigation}) {
  const [fontsLoaded] = useFonts({
    'Exo': require('../assets/fonts/Exo-Medium.ttf'),
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const postUser = async () =>{
    if(password !== confirmPassword){
      console.error("Passwords do not match");
      return
    }
    const logInData = {
      todo_user:{
        email: email,
        password: password,
      }
    }

    try{
      const response = await fetch("http://192.168.178.152:3000/todo_users", {
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

      postLogIn();
    } catch(error){
      console.error(error);
    }
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
      const authToken = data.headers.get('Authorization');

      console.log(authToken);

      setAuthToken(authToken);
    } catch(error){
      console.error(error);
    }
  }

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={Keyboard.dismiss}
    >
      <View style={styles.container}>
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
          <View style={styles.textInputWrapper}>
            <Feather name="lock" size={20} color="rgba(255,255,255, 0.5)" />
            <TextInput 
              style={styles.textInput} 
              secureTextEntry={true}
              placeholder='Confirm Password' 
              placeholderTextColor='rgba(255,255,255, 0.5)'
              onChangeText={setConfirmPassword}
              value={confirmPassword} />
          </View>
          <Pressable style={styles.logInButton} onPress={postUser}>
            <Text style={styles.logInButtonText}>Signup</Text>
          </Pressable>
        </View>
        <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.logInButtonText}>Login</Text>
        </Pressable>
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
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 40
  },
})