import React, {useContext, useState} from 'react';
import Constants from 'expo-constants';
import {View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';

export default function ForgotPassword({navigation}) {
  const [fontsLoaded] = useFonts({
    'Exo': require('../assets/fonts/Exo-Medium.ttf'),
  });
  
  const [email, setEmail] = useState('');

  const postResetPassword = async () =>{
    const resetData = {
      email: email
    }

    try{
      const response = await fetch("http://192.168.178.152:3000/todo_users/password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      })

      if (!response.ok) {
        const message = `An error has occured: ${response.status} - ${response.statusText}`;
        throw new Error(message);
      }

    } catch(error){
      console.error(error);
    }finally{
      setEmail('');
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
          <Pressable style={styles.submitButton} onPress={postResetPassword}>
            <Text style={styles.logInButtonText}>Submit</Text>
          </Pressable>
        </View>
        <View style={styles.buttonsWrapper}>
          <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('LogIn')}>
            <Text style={styles.logInButtonText}>Login</Text>
          </Pressable>
          <Pressable style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.logInButtonText}>SignUp</Text>
          </Pressable>
        </View>
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
  submitButton:{
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
  buttonsWrapper:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 40
  },
  signUpButton:{
    backgroundColor: '#262A30',
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
})