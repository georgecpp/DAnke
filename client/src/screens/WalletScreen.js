import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';

const WalletScreen = () => {

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
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={authenticateUser}>
          <Text>Wallet Screen</Text>
        </TouchableOpacity>
    </View>
  )
}

export default WalletScreen
