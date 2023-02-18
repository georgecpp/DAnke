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
import MetamaskSVG from '../assets/images/misc/metamask-fox.svg';


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
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={{ uri: userInfo.data.photo }}
              style={styles.userAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>
        {!connector.connected ? 
          <View style={styles.connectWallet}>
            <TouchableOpacity onPress={authenticateUser} style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect to Wallet</Text>
            </TouchableOpacity>
          </View>
        : 
          <View style={styles.connectedWallet}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>Connected account:</Text>
              <Text style={styles.accountValue}>{connector.session.accounts[0].slice(0,10)}</Text>
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Wallet provider:</Text>
              <Text style={styles.walletValue}>{connector.session.peerMeta.name}</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>DAC balance:</Text>
              <Text style={styles.balanceValue}>{balanceDAC}</Text>
            </View>
            <MetamaskSVG
            height={300}
            width={300}
            />
            <TouchableOpacity onPress={() => {connector.killSession();}} style={styles.disconnectButton}>
              <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2026',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  userAvatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  connectWallet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectedWallet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  accountLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  accountValue: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  walletInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  walletLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  walletValue: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  balanceInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disconnectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WalletScreen;