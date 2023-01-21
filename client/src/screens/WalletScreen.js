import React, {useState, useContext, useEffect} from 'react';
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

import "@ethersproject/shims"
import { ethers } from "ethers";
import { contract_address, contractABI } from '../web3/constants';




const WalletScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);
  const connector = useWalletConnect(); // Wallet connect hook
  const [balanceDAC, setBalanceDAC] = useState(0.0);


  const fetchBalanceDAC = async (addressFrom) => {
    const provider = new ethers.providers.AlchemyProvider('goerli', 'vlYolnH8xOcJ_nq6M0Edtj_KmkEGZTnw')
    const contractDAC = new ethers.Contract(contract_address, contractABI, provider);
    const balanceBigNumber = await contractDAC.balanceOf(addressFrom);
    const balance = ethers.utils.formatEther(balanceBigNumber)
    setBalanceDAC(balance);
  }
  const authenticateUser = async () => {
    if (connector.connected) {
      console.log(connector.session);
    }else{
      const session = await connector.connect();
    }
  }

  useEffect(() => {
    if(connector && connector.connected) 
      fetchBalanceDAC(connector.accounts[0]);
  }, [connector]); // Only re-run the effect if count changes

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
            <Text>DAC balance: {balanceDAC}</Text>
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