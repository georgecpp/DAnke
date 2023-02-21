import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Image,
  Text
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import Leaderboard from 'react-native-leaderboard';
import axios from "axios";

const LeaderboardScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(1);

  const alert = (title, body) => {
    Alert.alert(
        title, body, [{ text: 'OK', onPress: () => { } },],
        { cancelable: true }
    )
  }

  const sort = (data) => {
    const sorted = data && data.sort((item1, item2) => {
        return item2.highScore - item1.highScore;
    })
    let _userRank = sorted.findIndex((item) => {
        return item.userName === currentUser.userName;
    })
    setUserRank(++_userRank);
    return sorted;
  }

  const checkAccessTokenExpiredAndUpdate = (accessToken) => {
    return accessToken;
  }
  const getLeaderboardData = async () => {

    const accessToken =  checkAccessTokenExpiredAndUpdate(userInfo.data.googleAccessToken);
    console.log(userInfo.data);
    var _currentUser = {
      userName: userInfo.data.name,
      userAvatarUrl: userInfo.data.photo,
      highScore: 91,
    };
    setCurrentUser(_currentUser);
    

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
        }).filter(function(user){
          return user.userName !== _currentUser.userName
        });
        users.push(_currentUser);
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
    <View style={{ flex: 1, backgroundColor: 'white', }}>
      <LeaderboardHeader currentUser={currentUser} userRank={userRank}/>
      <Leaderboard
      data={leaderboardData}
      sortBy='highScore'
      icon='userAvatarUrl' 
      labelBy='userName'
      onRowPress = {(item, index) => {alert(item.userName + " clicked", item.highScore + " points, wow!") }}    
      sort={sort}
      />
    </View>
  )
}

const LeaderboardHeader = ({currentUser, userRank}) => {
  return (
    <View
      style={{ backgroundColor: '#56a774', padding: 15, paddingTop: 35, alignItems: 'center' }}>
      <Text style={{ fontSize: 25, color: 'white', }}>Leaderboard</Text>
      <View style={{
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          marginBottom: 15, marginTop: 20
      }}>
        {currentUser && 
          <>
            <Text style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                {ordinal_suffix_of(userRank)}
            </Text>
            <Image style={{ flex: .66, height: 60, width: 60, borderRadius: 60 / 2 }}
                source={{ uri: currentUser.userAvatarUrl}} />
            <Text style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                {currentUser.highScore}pts
            </Text>
         </>
        }
      </View>
    </View>
  )
}

const ordinal_suffix_of = (i) => {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

export default LeaderboardScreen;