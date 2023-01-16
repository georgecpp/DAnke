import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';


import { AuthContext } from '../context/AuthContext';


const WalletScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);
  const connector = useWalletConnect(); // Wallet connect hook

  const authenticateUser = async () => {
    if (connector.connected) {
      console.log('wallet - connected');
      console.log(connector.session);
    }else{
      const session = await connector.connect();
      // The session object will contain details about the chain you are connected to and also an accounts array
      console.log('wallet - not connected');
    }
  }

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
          <TouchableOpacity onPress={authenticateUser}>
            <Text>Connect to Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  </SafeAreaView>
  )
}

export default WalletScreen;