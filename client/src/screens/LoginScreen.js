import React, {useContext}  from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
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

const LoginScreen = ({navigation}) => {

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
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    const {name, email, photo} = userInfo.user;
    login(name, email, photo, tokens.accessToken);
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

export default LoginScreen;