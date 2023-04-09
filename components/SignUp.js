import React, {useContext, useState, useEffect} from 'react';
import Constants from 'expo-constants';
import {View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, Keyboard, Dimensions} from 'react-native';
import {Context} from '../App'
import { Feather } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import { ScrollView } from 'react-native-gesture-handler';
import { postUser } from '../api';
import { ActivityIndicator } from 'react-native';

export default function SignUp({navigation}) {
  const [fontsLoaded] = useFonts({
    'Exo': require('../assets/fonts/Exo-Medium.ttf'),
  });
  
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [passwordIs8Characters, setPasswordIs8Characters] = useState(false);
  const [passwordContainsNumber, setPasswordContainsNumber] = useState(false);
  const [passwordContainsLowercase, setPasswordContainsLowercase] = useState(false);
  const [passwordContainsUppercase, setPasswordContainsUppercase] = useState(false);
  const [passwordContainsSpecialChar, setPasswordContainsSpecialChar] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isPostable, setIsPostable] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/; 

  const {
    authToken,
    setAuthToken
  } = useContext(Context)

  const validatePassword = () =>{
    if(regex.test(password)){
      console.log('valid')
      setIsValidPassword(true);
    }
    else{
      console.log('invalid')
      setIsValidPassword(false);
    }
  }

  const updatePasswordValidationMessage = () =>{

    if(password.length >= 8){
      setPasswordIs8Characters(true);
    }
    else{
      setPasswordIs8Characters(false);
    }

    if(/[0-9]/.test(password)){
      setPasswordContainsNumber(true)
    }
    else{
      setPasswordContainsNumber(false)
    }

    if(/[a-z]/.test(password)){
      setPasswordContainsLowercase(true)
    }
    else{
      setPasswordContainsLowercase(false)
    }

    if(/[A-Z]/.test(password)){
      setPasswordContainsUppercase(true)
    }
    else{
      setPasswordContainsUppercase(false)
    }

    if(/[^a-zA-Z0-9]/.test(password)){
      setPasswordContainsSpecialChar(true)
    }
    else{
      setPasswordContainsSpecialChar(false)
    }
  }

  const validateEmail = () =>{
    if(/^\S+@\S+\.\S+$/.test(email)){
      setIsValidEmail(true);
    }
    else{
      setIsValidEmail(false);
    }
  }

  const validateConfirmPassword = () =>{
    if(password === confirmPassword){
      setIsValidConfirmPassword(true);
    }
    else{
      setIsValidConfirmPassword(false);
    }
  }

  const validatePostable = () =>{
    if(isValidEmail && isValidPassword && isValidConfirmPassword){
      setIsPostable(true);
    }
    else{
      setIsPostable(false);
    }
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

  useEffect(() =>{
    validatePassword();
    updatePasswordValidationMessage();

    validateConfirmPassword(confirmPassword);
  }, [password])

  useEffect(() =>{
    validateEmail();
  }, [email])

  useEffect(() =>{
    validateConfirmPassword(confirmPassword);
  }, [confirmPassword])

  useEffect(() =>{
    validatePostable();
  }, [isValidEmail, isValidPassword, isValidConfirmPassword])

  return (
    // <TouchableOpacity
    //   style={{ flex: 1 }}
    //   activeOpacity={1}
    //   onPress={Keyboard.dismiss}
    // >
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
          <View style={[styles.textInputWrapper, !isValidEmail? styles.redBorder : styles.invisibleBorder]}>
            <Feather name="mail" size={20} color="rgba(255,255,255, 0.5)" />
            <TextInput 
              style={styles.textInput} 
              placeholder='E-Mail' 
              placeholderTextColor='rgba(255,255,255, 0.5)'
              onChangeText={setEmail}
              value={email}
              inputMode='email'
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
              onEndEditing={event => {
                console.log('test');
                if(event.nativeEvent.text.length === 0) {
                  setPassword('');
                }
              }}
              value={password} />
          </View>
          <View style={styles.passwordInfoWrapper}>
            <View style={styles.flexRow}>
              {passwordIs8Characters ? (
                <Feather name="check" size={18} color="#81A4CD" />
              ): (
                <Feather name="x" size={18} color="red" />
              )
              }
              <Text style={styles.passwordInfoText}>Atleast 8 characters</Text>
            </View>
            <View style={styles.flexRow}>
              {passwordContainsNumber ? (
                <Feather name="check" size={18} color="#81A4CD" />
              ): (
                <Feather name="x" size={18} color="red" />
              )
              }
              <Text style={styles.passwordInfoText}>Atleast 1 number</Text>
            </View>
            <View style={styles.flexRow}>
              {passwordContainsLowercase ? (
                <Feather name="check" size={18} color="#81A4CD" />
              ): (
                <Feather name="x" size={18} color="red" />
              )
              }
              <Text style={styles.passwordInfoText}>Atleast 1 lowercase letter</Text>
            </View>
            <View style={styles.flexRow}>
              {passwordContainsUppercase ? (
                <Feather name="check" size={18} color="#81A4CD" />
              ): (
                <Feather name="x" size={18} color="red" />
              )
              }
              <Text style={styles.passwordInfoText}>Atleast 1 capital letter</Text>
            </View>
            <View style={styles.flexRow}>
              {passwordContainsSpecialChar ? (
                <Feather name="check" size={18} color="#81A4CD" />
              ): (
                <Feather name="x" size={18} color="red" />
              )
              }
              <Text style={styles.passwordInfoText}>Atleast 1 special character</Text>
            </View>
          </View>
          <View style={[styles.textInputWrapper, styles.marginBottomTen]}>
            <Feather name="lock" size={20} color="rgba(255,255,255, 0.5)" />
            <TextInput 
              style={styles.textInput} 
              secureTextEntry={true}
              placeholder='Confirm Password' 
              placeholderTextColor='rgba(255,255,255, 0.5)'
              onChangeText={setConfirmPassword}
              value={confirmPassword} />
          </View>
          <View style={[styles.passwordInfoWrapper, styles.marginTopZero]}>
          {isValidConfirmPassword ? (
                <View style={styles.flexRow}>
                  <Feather name="check" size={18} color="#81A4CD" />
                  <Text style={styles.passwordInfoText}>Passwords match</Text>
                  </View>
              ): (
                <View style={styles.flexRow}>
                  <Feather name="x" size={18} color="red" />
                  <Text style={styles.passwordInfoText}>Passwords need to match</Text>
                </View>
              )
          }
          </View>
          <Pressable 
            style={[styles.logInButton, !isPostable ? styles.disabledButton : styles.logInButton]} 
            onPress={()=>postUser(email, isValidPassword, password, confirmPassword, setAuthToken, setLoading)} 
            disabled={!isPostable}
          >
            {!isLoading ? (
              <Text 
                style={[styles.logInButtonText,
                      !isPostable ? styles.disabledButtonText : styles.logInButtonText]}
              >
                Signup
              </Text>
            ): (
              <ActivityIndicator size='small' color='#ffffff' style={styles.activityIndicator}/>
            )

            }
          </Pressable>
        </View>
        <Pressable 
          style={styles.signUpButton} 
          onPress={() => navigation.navigate('LogIn')}
        >
          <Text style={styles.logInButtonText}>Login</Text>
        </Pressable>
      </View>
      </ScrollView>
      </View>
    // </TouchableOpacity>
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
  passwordInfoWrapper:{
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 10,
    marginTop: -10
  },
  passwordInfoText:{
    color: 'rgba(255,255,255, 0.5)',
    fontSize: 14
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
    width: '88%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 40
  },
  marginBottomTen:{
    marginBottom: 10,
  },
  marginTopZero:{
    marginTop: 0,
  },
  disabledButton:{
    backgroundColor: '#383D44',
  },
  disabledButtonText:{
    color: 'rgba(255,255,255, 0.2)',
  },
  valid:{
    color: 'green',
  },
  invalid:{
    color: 'red',
  },
  flexRow:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  redBorder:{
    borderColor: 'red',
    borderWidth: 2,
  },
  invisibleBorder:{
    borderWidth: 2,
    borderColor: '#1B1E23',
  },
  activityIndicator:{
    padding: 2,
  },
})