import React, {useRef, useEffect} from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Animated } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Ethereum from '../assets/images/misc/ethereum_logo.svg';

const OnboardingScreen = ({navigation}) => {

  const rotation = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    startRotation();
  }, []);  

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f2026',
      }}>
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
          Thankful 🤝🏻 in Web3!
          </Text>
        </View>
        <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            >
              <Ethereum width={300} height={300} />
        </Animated.View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#7289DA',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() => navigation.navigate('Login')}
        >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Roboto-MediumItalic',
          }}>
          Let's Begin
        </Text>
        <Icon name='arrow-forward-ios' color='white' size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;