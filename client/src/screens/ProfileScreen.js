import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';


const ProfileScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
            marginBottom: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={{uri:userInfo.data.photo}}
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text>Profile Screen</Text>
        </View>
      </ScrollView>
  </SafeAreaView>
  )
}

export default ProfileScreen;