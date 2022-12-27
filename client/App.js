import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import HealthComponent from './components/HealthComponent';

const App = () => {

  return (
    <View>
      <Text>DAnke</Text>
      <HealthComponent />
    </View>
  );
};

export default App;
