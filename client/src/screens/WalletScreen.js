import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet
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
        {!connector.connected ? 
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={authenticateUser}>
              <Text>Connect to Wallet</Text>
            </TouchableOpacity>
          </View>
        : 
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>Connected account: {connector.session.accounts[0].slice(0,10)}</Text>
            <Text>Wallet provider: {connector.session.peerMeta.name}</Text>
            <Image
              style={styles.logo}
              source={{
                uri: connector.session.peerMeta.icons[0],
              }}
            />
            <TouchableOpacity onPress={() => {connector.killSession();}}>
              <Text>Kill session</Text>
            </TouchableOpacity>
          </View>
      }
      </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default WalletScreen;