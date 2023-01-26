import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import Leaderboard from 'react-native-leaderboard';
import axios from "axios";

const LeaderboardScreen = ({navigation}) => {
  const {userInfo} = useContext(AuthContext);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const getLeaderboardData = async () => {
    var config = {
      method: 'get',
      url: 'https://people.googleapis.com/v1/people/me/connections?pageSize=1000&personFields=names,phoneNumbers,photos&sortOrder=FIRST_NAME_ASCENDING',
      headers: { 
        'Authorization': `Bearer ${userInfo.data.googleAccessToken}`
      }
    };

    axios(config)
    .then(function (response) {
      if(response.status === 200) {
        var users = response.data.connections.map(function (connection){
          return {
            userName: connection.names[0].displayName,
            userAvatarUrl: connection.photos[0].url,
            highScore: 90
          }
        });
        users.push({
          userName: userInfo.data.name,
          userAvatarUrl: userInfo.data.photo,
          highScore: 100
        })
        setLeaderboardData(users);
      }
      else {
        const dummyusers = [
          {userName: 'User1', userAvatarUrl: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', highScore: 52},
          {userName: 'User2', userAvatarUrl: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png', highScore: 120},
        ]
        setLeaderboardData(dummyusers);
      }
    })
    .catch(function (error) {
      Alert.alert(error);
    });
  }

  useEffect(() => {
    getLeaderboardData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff',padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-end',
            marginBottom: 20
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={{uri:userInfo.data.photo}}
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
            />
          </TouchableOpacity>
        </View>
        <Leaderboard 
        data={leaderboardData}
        sortBy='highScore'
        icon='userAvatarUrl' 
        labelBy='userName'/>
  </SafeAreaView>
  )
}

export default LeaderboardScreen;