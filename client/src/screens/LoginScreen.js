import React, {useContext, useState, useRef}  from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import LoginSVG from '../assets/images/misc/login.svg';
import GoogleSVG from '../assets/images/misc/google.svg';
import FacebookSVG from '../assets/images/misc/facebook.svg';
import TwitterSVG from '../assets/images/misc/twitter.svg';

import SocialMediaButton from '../components/SocialMediaButton';
import { AuthContext } from '../context/AuthContext';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import PhoneInput from "react-native-phone-number-input";

const LoginScreen = ({navigation}) => {
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInput = useRef(null);
  const {login} = useContext(AuthContext);

  GoogleSignin.configure({
    webClientId: '1069286417092-vtilvanv1eo8jg9ts16pcjl38dc5o9l4.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    scopes:[
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.heart_rate.read',
      'https://www.googleapis.com/auth/fitness.sleep.read'
    ]
  });
  
  const _googleSignIn = async () => {
    const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
    if(!checkValid) {
      Alert.alert('invalid phone number! cannot proceed.');
      return;
    }
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const {name, email, photo} = userInfo.user;
    login(name, email, photo, phoneNumber, tokens.accessToken);
  }

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <LoginSVG
            height={300}
            width={300}
            style={{transform: [{rotate: '-5deg'}]}}
          />
        </View>
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="RO"
          layout="first"
          withShadow
          autoFocus
          containerStyle={styleSheet.phoneNumberView}
          textContainerStyle={{ paddingVertical: 0 }}
          onChangeFormattedText={text => {
            setPhoneNumber(text);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
            <SocialMediaButton 
              buttonTitle="Google"
              btnType="google"
              color="black"
              backgroundColors={["#ffffff", "#ffffff"]}
              source={require('../assets/images/search.png')}
              marginLeftIcon={5}
              onPress={() => {_googleSignIn()}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styleSheet = StyleSheet.create({

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading:{
    fontSize: 24,
    textAlign: 'center',
    paddingBottom: 20,
    color: 'black'
  },

  phoneNumberView: {
    width: '80%',
    height: 50,
    backgroundColor: 'white'
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    width: '80%',
    padding: 8,
    backgroundColor: '#00B8D4',
  },

  buttonText:{
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  }
});

export default LoginScreen;