import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';
import { AuthContext } from '../context/AuthContext';

import "@ethersproject/shims"
import { ethers } from "ethers";
import { contract_address, contractABI } from '../web3/constants';
import MetamaskSVG from '../assets/images/misc/metamask-fox.svg';
import LatestTxs from '../components/LatestTxs';
import SocialMediaButton from '../components/SocialMediaButton';
import RewardTracker from '../components/RewardTracker';
import axios from "axios";
import { BASE_URL } from "../utils/config";


const ANIMATION_DURATION = 5000;

const WalletScreen = ({navigation}) => {

  // var blockNumber = 8567394;
  const originBlockNumber = 8567394;
  const [blockNumber, setBlockNumber] = useState(originBlockNumber);
  const [increment, setIncrement] = useState(true);
  const [animationValue] = useState(new Animated.Value(0));

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopAnimation = () => {
    Animated.timing(animationValue).stop();
    animationValue.setValue(0);
  };

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

  const walletauth = async (walletAddress) => {
    axios.post(`${BASE_URL}/auth/wallet-auth`, {
        email: userInfo.data.email,
        walletAddress: walletAddress
    })
    .then(res => {
      if(res.status !== 200) {
        Alert.alert('wallet address not sent correctly: ' + res.statusText);
      }
    })
    .catch(e => {
        Alert.alert(`wallet address send error: ${e}`);
    });
  }

  const authenticateUser = async () => {
    if (connector.connected) {
      console.log(connector.session);
    }else{
      const session = await connector.connect();
      walletauth(session.accounts[0]);
    }
  }

  useEffect(() => {
    if(connector && connector.connected) 
      fetchBalanceDAC(connector.accounts[0]);
  }, [connector]); // Only re-run the effect if count changes

  useEffect(() => {
    startAnimation();
    return function cleanup() {
      stopAnimation();
    };
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(increment) {
        if(blockNumber === originBlockNumber + 5) {
          setIncrement(false);
        }
        else {
          setBlockNumber(blockNumber => blockNumber +1);
        }
      }
      else {
        if(blockNumber === originBlockNumber) {
          setIncrement(true);
        }
        else {
          setBlockNumber(blockNumber => blockNumber -1);
        }
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [increment, blockNumber]);

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
        {!connector.connected ? (
          <View style={styles.connectWallet}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 30,
              }}>
              <SocialMediaButton 
                    buttonTitle="Connect to wallet"
                    btnType="google"
                    color="white"
                    // backgroundColors={["#fff", "#7289DA", "#7289DA"]}
                    backgroundColors={["#fff", "#3999fc", "#3999fc", "#3999fc"]}
                    // backgroundColors={["#fff","#f8b26a", "#f47e60", "#e15b64"]}
                    // backgroundColors={["#93dbe9", "#689cc5", "#5e6fa3", "#3b4368"]}
                    source={require('../assets/images/walletconnect.png')}
                    marginLeftIcon={5}
                    onPress={() => {
                      stopAnimation();
                      authenticateUser();
                    }} 
              />
            </View>
            <Animated.View
              style={[
                styles.loadingContainer,
                {
                  opacity: animationValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 0],
                  }),
                },
              ]}
            >
              <MetamaskSVG
                height={200}
                width={200}
              />
            </Animated.View>
            <LatestTxs blockNo={(blockNumber).toString(16)} />
          </View>
         ) : ( 
          <ScrollView>
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
                <Text style={styles.balanceValue}>{balanceDAC}⚡</Text>
              </View>
              <MetamaskSVG
              height={200}
              width={200}
              />
              <TouchableOpacity onPress={() => {connector.killSession(); startAnimation()}} style={styles.disconnectButton}>
                <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
              </TouchableOpacity>
              <RewardTracker />
            </View>
          </ScrollView>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectTextContainer: {
    marginTop: 0,
    alignItems: 'center',
  },
  connectText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 3,
  },
});

export default WalletScreen;