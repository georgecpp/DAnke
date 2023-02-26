import React, {useContext, useState, useRef, useEffect}  from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
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

  const [scale] = useState(new Animated.Value(1));
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const [phoneNumber, setPhoneNumber] = useState('');
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

  useEffect(() => {
    const inhaleScale = Animated.timing(scale, {
      toValue: 1.2,
      duration: 1500,
      useNativeDriver: true,
    });
    const exhaleScale = Animated.timing(scale, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });
    const inhalePosition = Animated.timing(position, {
      toValue: { x: 0, y: 25 },
      duration: 1500,
      useNativeDriver: true,
    });
    const exhalePosition = Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 1500,
      useNativeDriver: true,
    });
    const inhale = Animated.parallel([inhaleScale, inhalePosition]);
    const exhale = Animated.parallel([exhaleScale, exhalePosition]);
    const sequence = Animated.sequence([inhale, exhale]);

    // Start the animation loop
    Animated.loop(sequence).start();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#1f2026'}}>
      <TouchableOpacity style={{padding:15}} onPress={() => navigation.navigate('Onboarding')}>
        <AntDesign name="arrowleft" size={30} color="white" style={{backgroundColor: '#1f2026'}} />
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
          <View style={{ alignItems: 'center' }}>
            <Animated.View
               style={{
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { scale: scale },
                ],
              }}>
            <BlockchainLink height={300} width={300} />
          </Animated.View>
         </View>
        </View>
        <View style={{paddingHorizontal: 25}}>
          <View style={{alignItems:'center', flexDirection: 'column'}}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              defaultCode="RO"
              layout="first"
              autoFocus={false}
              containerStyle={styleSheet.phoneNumberView}
              flagButtonStyle={{}}
              textContainerStyle={{ paddingVertical: 0, borderRadius: 10 }}
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
                  // backgroundColors={["#fff", "#7289DA", "#7289DA"]}
                  backgroundColors={["#f8b26a", "#f47e60", "#e15b64", "#333333"]}
                  // backgroundColors={["#fff","#f8b26a", "#f47e60", "#e15b64"]}
                  // backgroundColors={["#93dbe9", "#689cc5", "#5e6fa3", "#3b4368"]}
                  source={require('../assets/images/search.png')}
                  marginLeftIcon={5}
                  onPress={() => {_googleSignIn()}}
              />
            </View>
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
    height: 50,
    backgroundColor: '#f8b26a',
    // width: "40%",
    borderRadius: 10,
    margin:10,
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