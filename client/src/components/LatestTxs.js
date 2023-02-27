import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import axios from "axios";

const apiKey = '9QMQB9RCR6QN2MZI92DVCHB26Z4HQ6DD6I';
const endpoint = `https://api-goerli.etherscan.io/api`;

const ANIMATION_DURATION = 5000;

const LatestTxs = ({ blockNo }) => {
  const [transactions, setTransactions] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopAnimation = () => {
    Animated.timing(fadeAnim).stop();
    fadeAnim.setValue(0);
  };

  const getTxs = async () => {
    const blockDetail = await axios.get(
      endpoint +
        `?module=proxy&action=eth_getBlockByNumber&tag=${blockNo}&boolean=true&apikey=${apiKey}`
    );
    const { transactions } = blockDetail.data.result;

    let txsDetails = [];

    for (let i = 0; i < 3; i = i + 1) {
      const tx = transactions[i];
      txsDetails.push(
        <View key={i} style={styles.transactionContainer}>
          <Text style={styles.transactionTitle}>
            Tx: {tx.hash.slice(0,10)}
          </Text>
          <Text style={styles.transactionInfo}>
            From: {tx.from.slice(0,10)} {"\n"}
            To: {tx.to.slice(0,10)}
          </Text>
          <Text style={styles.transactionInfo}>
            Eth: {parseInt(tx.value) / 10 ** 18} ⚡	
          </Text>
        </View>
      );
    }

    setTransactions(txsDetails);
    fadeIn();
  };

  useEffect(() => {
    getTxs();
    return function cleanup() {
        stopAnimation();
    }
  }, [blockNo]);

  return (
    <Animated.View style={[
            styles.loadingContainer,
            {
                opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
                }),
            },
            ]}
        >
      <Text style={styles.title}>Latest Transactions on Ethereum</Text>
      {transactions}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    margin: 10,
  },
  title: {
    color: "#1d6fa5",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  transactionTitle: {
    color: "#1d6fa5",
    fontWeight: "bold",
  },
  transactionInfo: {
    color: "#696969",
  },
});

export default LatestTxs;