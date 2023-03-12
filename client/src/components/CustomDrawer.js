import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/AuthContext';
// import { shareInstagramStory } from '../utils/SocialShare';
import Share from "react-native-share";
import { ethereumDiamondB64, dankeIgStoryB64, dankeIgStoryStarsB64 } from '../utils/config';

const CustomDrawer = props => {

  const {logout, userInfo} = useContext(AuthContext);
  const [hasInstagramInstalled, setHasInstagramInstalled] = useState(false);
  useEffect(() => {
    if (Platform.OS === "ios") {
      Linking.canOpenURL("instagram://").then((val) =>
        setHasInstagramInstalled(val),
      );
    } else {
      Share.isPackageInstalled("com.instagram.android").then(
        ({ isInstalled }) => setHasInstagramInstalled(isInstalled),
      );
    }
}, []);

async function shareInstagramStory(title) {
  try {
    if (hasInstagramInstalled) {
      await Share.shareSingle({
        appId: '943438360159496', // Note: replace this with your own appId from facebook developer account, it won't work without it. (https://developers.facebook.com/docs/development/register/)
        message: 'DAnke',
        title: title,
        social: Share.Social.INSTAGRAM_STORIES,
        backgroundBottomColor: "#1D1D1D", // You can use any hexcode here and below
        backgroundTopColor: "#1D1D1D",
        backgroundImage: dankeIgStoryB64, // This field is optional like the other fields (except appId) and you have to put a base64 encoded image here if you want to use it!
      });
    } else {
      Alert.alert('Instagram not installed on this device!');
    }
  } catch (error) {
    console.error(error);
  }
}    
  return (
    <View style={{flex: 1, backgroundColor: '#1f2026'}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#1f2026'}}>
        <ImageBackground
          source={require('../assets/images/menu-bg-disc-3.png')}
          style={{padding: 20}}>
          <Image
            source={{uri:userInfo.data.photo}}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {userInfo.data.name}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#1f2026', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#7289DA'}}>
        <TouchableOpacity onPress={
              async() => {
                await shareInstagramStory('Share with your friends on Instagram!');
              }
            }
         style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="logo-instagram" size={22} color='#fff'/>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: '#fff'
              }}>
              Tell your friends!
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {logout()}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} color='#fff' />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: '#fff'
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
