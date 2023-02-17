import React, { useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from '../context/AuthContext';

export const navigationRef = React.createRef();
export function openDrawer(routeName, params) {
    navigationRef.current.dispatch(DrawerActions.openDrawer());
}

const AppNav = () => {
    const {isLoading, userToken} = useContext(AuthContext);
    
    if(isLoading) {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }
    return (
        <NavigationContainer ref={navigationRef}>
            {userToken !== null ? <AppStack /> : <AuthStack/>}
        </NavigationContainer>
    );
}



export default AppNav;