import React, {useContext, useState, useRef, useEffect}  from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import BlockchainLink from '../assets/images/misc/blockchain-link.svg';

import SocialMediaButton from '../components/SocialMediaButton';
import { AuthContext } from '../context/AuthContext';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import PhoneInput from "react-native-phone-number-input";
import axios from "axios";
import { requestUserPermission } from '../utils/NotificationUtils';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LoginScreen = ({navigation}) => {
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tokens, setTokens] = useState(null);
  const phoneInput = useRef(null);
  const {login} = useContext(AuthContext);

  GoogleSignin.configure({
    webClientId: '1069286417092-vtilvanv1eo8jg9ts16pcjl38dc5o9l4.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
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
    const {name, email, photo} = userInfo.user;
    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: `https://oauth2.googleapis.com/token?client_id=1069286417092-vtilvanv1eo8jg9ts16pcjl38dc5o9l4.apps.googleusercontent.com&client_secret=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&code=${userInfo.serverAuthCode}&grant_type=authorization_code&redirect_uri=https://danke-a8686.firebaseapp.com/__/auth/handler`,
      headers: { }
    };
    axios(config)
    .then(function (response) {
      if(response.status === 200) {
        login(name, email, photo, phoneNumber,
           response.data.access_token,
           response.data.refresh_token);
      }
    })
    .catch(function (error) {
      Alert.alert(error);
    });
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#1f2026'}}>
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={26} color="white" style={{backgroundColor: '#1f2026'}} />
      </TouchableOpacity>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <View>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontWeight: 'bold',
              fontSize: 45,
              color: '#fff',
            }}>
            DAnke
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontWeight: 'bold',
              fontSize: 25,
              color: '#fff',
            }}>
          Let's connect first! 🔗
          </Text>
          <View style={{alignItems: 'center'}}>
            <BlockchainLink
              height={300}
              width={300}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems:'center', flexDirection: 'column'}}>
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
                color="white"
                backgroundColors={["#fff", "#7289DA"]}
                source={require('../assets/images/search.png')}
                marginLeftIcon={5}
                onPress={() => {_googleSignIn()}}
            />
          </View>
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
    backgroundColor: '#7289DA'
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
  },
});

export default LoginScreen;