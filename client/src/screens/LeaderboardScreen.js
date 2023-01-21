import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
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
      url: 'https://people.googleapis.com/v1/people/me/connections?personFields=names&sortOrder=FIRST_NAME_ASCENDING',
      headers: { 
        'Authorization': `Bearer ${userInfo.data.googleAccessToken}`
      }
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
    const users = [
      {userName: 'Joe', highScore: 52},
      {userName: 'Jenny', highScore: 120},
    ]
    setLeaderboardData(users);
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
        labelBy='userName'/>
  </SafeAreaView>
  )
}

export default LeaderboardScreen;