import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import HealthComponent from '../components/HealthComponent';

import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({navigation}) {

  const {userInfo} = useContext(AuthContext);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <HealthComponent />
    </SafeAreaView>
  );
}
