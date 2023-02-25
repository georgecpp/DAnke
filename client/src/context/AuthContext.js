import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {createContext, useState, useEffect} from "react";
import { BASE_URL } from "../utils/config";
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';
import messaging from '@react-native-firebase/messaging';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const connector = useWalletConnect(); // Wallet connect hook
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = async (name, email, photo,phoneNumber, googleAccessToken, googleRefreshToken) => {
        setIsLoading(true);
        // axios.post(`${BASE_URL}/auth/social-auth`, {
        //     name: name,
        //     email: email,
        //     photo: photo
        // })
        // .then(res => {
        //     let userInfo = res.data;
        //     setUserInfo(userInfo);
        //     setUserToken(userInfo.data.token);

        //     AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        //     AsyncStorage.setItem('userToken', userInfo.data.token);
        // })
        // .catch(e => {
        //     console.log(`Login error: ${e}`);
        // });
        const fcmRegistrationToken = await messaging().getToken();
          if (!fcmRegistrationToken) {
            Alert.alert(
              'Firebase token registration error! User will not receive notifications...',
            );
        }
        let userInfo = {
            data: {
                name: name,
                email: email,
                photo: photo,
                phoneNumber: phoneNumber,
                googleAccessToken: googleAccessToken,
                googleRefreshToken: googleRefreshToken,
                fcmRegistrationToken: fcmRegistrationToken,
                token: 'asdasdas'
            },
            statusCode: 200
        }
        setUserInfo(userInfo);
        setUserToken(userInfo.data.token);

        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        await AsyncStorage.setItem('userToken', userInfo.data.token);
        console.log(fcmRegistrationToken);
        setIsLoading(false);
    }

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
        if(connector) {
            await connector.killSession();
        }
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
        
            userInfo = JSON.parse(userInfo);
            
            if(userInfo) {
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            setIsLoading(false);
        }
        catch(e) {
            console.log(`isLogged in error ${e}`);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    );
} 