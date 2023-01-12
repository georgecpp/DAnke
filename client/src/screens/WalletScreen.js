import React from 'react'
import { View, Text } from 'react-native'
import SignClient from "@walletconnect/sign-client";
import { TouchableOpacity } from 'react-native-gesture-handler';

const handleConnect = async () => {
    try {
      const signClient = await SignClient.init({
        projectId: "967e0650171c7177eaeb8a4ee8f5d84f",
        metadata: {
            name: "MyApp",
            description: "MyApp",
            url: "#",
            icons: ["https://walletconnect.com/walletconnect-logo.png"],
        },
    });
      console.log("connect get_V2", signClient.core.pairing.getPairings());
    }
    catch(err) {
      console.log(err)
    }
  }

const WalletScreen = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity onPress={handleConnect}>
        <Text>Wallet Screen</Text>
      </TouchableOpacity>
    </View>
  )
}

export default WalletScreen
