import React from 'react';

import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {

  return (
    <WalletConnectProvider
      redirectUrl={`wmw://app`} // Explained below
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}>
        <AuthProvider>
          <AppNav />
        </AuthProvider>
    </WalletConnectProvider>
  );
};

export default App;
