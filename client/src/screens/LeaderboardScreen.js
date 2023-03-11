import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Image,
  Text,
  ActivityIndicator
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import Leaderboard from '../components/Leaderboard';
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

  const getLeaderboardData = async () => {
    
    const todayRewardsResponse = await axios.get(`http://3.69.101.106:2409/reward/todayRewards`);
    const usersRewards = todayRewardsResponse.data;
    const _currentUser = usersRewards.find(user => user.phoneNumber === userInfo.data.phoneNumber);
    setCurrentUser({
      userName: _currentUser.name,
      userAvatarUrl: _currentUser.photo,
      highScore: _currentUser.rewardToday
    });    
    const refreshAccessTokenResponse = await axios.post(`https://oauth2.googleapis.com/token?client_id=1069286417092-vtilvanv1eo8jg9ts16pcjl38dc5o9l4.apps.googleusercontent.com&client_secret=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&grant_type=refresh_token&refresh_token=${userInfo.data.googleRefreshToken}`, {});
    const refreshedAccessToken = refreshAccessTokenResponse.data.access_token;
    var peopleAPIConfig = {
      method: 'get',
      url: 'https://people.googleapis.com/v1/people/me/connections?pageSize=1000&personFields=names,phoneNumbers,photos&sortOrder=FIRST_NAME_ASCENDING',
      headers: { 
        'Authorization': `Bearer ${refreshedAccessToken}`
      }
    };

    axios(peopleAPIConfig)
    .then(function (response) {
      if(response.status === 200) {
        var users = response.data.connections
        .filter(connection => { 
            for(i=0;i<usersRewards.length;i++) {
              if(usersRewards[i].phoneNumber === connection.phoneNumbers[0].canonicalForm && connection.phoneNumbers[0].canonicalForm !== _currentUser.phoneNumber)
                return true;
            }
            return false;
          })
        .map((connection) => {
          var rewardTodayForThatUser = 0;
            for(i=0;i<usersRewards.length;i++) {
              if(usersRewards[i].phoneNumber === connection.phoneNumbers[0].canonicalForm) {
                rewardTodayForThatUser = usersRewards[i].rewardToday;
              }
            }
          return {
            userName: connection.names[0].displayName,
            userAvatarUrl: connection.photos[0].url,
            highScore: rewardTodayForThatUser
          }
        });
        users.push({
          userName: _currentUser.name,
          userAvatarUrl: _currentUser.photo,
          highScore: _currentUser.rewardToday
        });
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
    <View style={{ flex: 1, backgroundColor: '#1f2026', }}>
      {currentUser!==null && leaderboardData.length > 0 ?
      <>
        <LeaderboardHeader currentUser={currentUser} userRank={userRank}/>
        <Leaderboard
        data={leaderboardData}
        sortBy='highScore'
        icon='userAvatarUrl' 
        labelBy='userName'
        onRowPress = {(item, index) => {alert(item.userName + " clicked", item.highScore + " points, wow!") }}    
        oddRowColor="#7289DA"
        evenRowColor="#1f2026"
        labelStyle={{color: 'white'}}
        rankStyle={{color: 'white'}}
        scoreStyle={{color: 'white'}}
        sort={sort}
        />
      </>
      :
      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    }
    </View>
  )
}

const LeaderboardHeader = ({currentUser, userRank}) => {
  return (
    <View
      style={{ backgroundColor: '#2C2F33', padding: 15, paddingTop: 35, alignItems: 'center' }}>
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