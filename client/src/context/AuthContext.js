import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {createContext, useState, useEffect} from "react";
import { BASE_URL } from "../utils/config";
import WalletConnectProvider, { useWalletConnect } from '@walletconnect/react-native-dapp';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const connector = useWalletConnect(); // Wallet connect hook
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const login = (name, email, photo, googleAccessToken) => {
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
        let userInfo = {
            data: {
                name: name,
                email: email,
                photo: photo,
                googleAccessToken: googleAccessToken,
                token: 'asdasdas'
            },
            statusCode: 200
        }
        setUserInfo(userInfo);
        setUserToken(userInfo.data.token);

        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        AsyncStorage.setItem('userToken', userInfo.data.token);

        setIsLoading(false);
    }

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userInfo');
        setIsLoading(false);
        if(connector) {
            connector.killSession();
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