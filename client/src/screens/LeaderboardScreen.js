import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Image,
  Text,
  ActivityIndicator,
  Modal,
  StyleSheet
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import Leaderboard from '../components/Leaderboard';
import { openDrawer } from "../utils/NavigationService";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from '../utils/config';

const LeaderboardScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const sendReact = async (userFrom, userTo, reactType) => {
    try {
      const sendReactResponse = await axios.post(`${BASE_URL}/reacts/sendReact`, {
        userFrom: userFrom,
        userTo: userTo,
        reactType: reactType
      });
      if(sendReactResponse.status === 200) {
        if(reactType === 'like') {
          alert('Like', `You liked ${selectedUser.userName}!`)
        }
        else if(reactType === 'congrats') {
          alert('Congrats', `You congratulated ${selectedUser.userName}!`)
        }
        else {
          alert('Roast', `You roasted ${selectedUser.userName}!`)
        }
      }
    }
    catch(err) {
      Alert.alert(err);
    }
  };

  const getLeaderboardData = async () => {
    
    const todayRewardsResponse = await axios.get(`${BASE_URL}/reward/todayRewards`);
    const usersRewards = todayRewardsResponse.data;
    const _currentUser = usersRewards.find(user => user.phoneNumber === userInfo.data.phoneNumber);
    setCurrentUser({
      userName: _currentUser.name,
      userAvatarUrl: _currentUser.photo,
      highScore: _currentUser.rewardToday.toFixed(0)
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
          var thatUserId = "";
            for(i=0;i<usersRewards.length;i++) {
              if(usersRewards[i].phoneNumber === connection.phoneNumbers[0].canonicalForm) {
                rewardTodayForThatUser = usersRewards[i].rewardToday;
                thatUserId = usersRewards[i].id;
              }
            }
          return {
            userId: thatUserId,
            userName: connection.names[0].displayName,
            userAvatarUrl: connection.photos[0].url,
            highScore: rewardTodayForThatUser.toFixed(0),
          }
        });
        users.push({
          userId: _currentUser.id,
          userName: _currentUser.name,
          userAvatarUrl: _currentUser.photo,
          highScore: _currentUser.rewardToday.toFixed(0),
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
      Alert.alert("Error", error.message);
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
        // onRowPress = {(item, index) => {alert(item.userName + " clicked", item.highScore + " points, wow!") }}    
        onRowPress={(item, index) => setSelectedUser(item)}
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
    {selectedUser && (
        <Modal
        visible={selectedUser !== null}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  sendReact(userInfo.data.id, selectedUser.userId, 'like')                  
                }}
                style={styles.modalButton}
              >
                <Icon name="thumbs-up" size={25} color="#3b5998" />
                <Text style={styles.modalButtonText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  sendReact(userInfo.data.id, selectedUser.userId, 'congrats')
                }}
                style={styles.modalButton}
              >
                <Icon name="trophy" size={25} color="#ffcc00" />
                <Text style={styles.modalButtonText}>Congrats</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  sendReact(userInfo.data.id, selectedUser.userId, 'roast')
                }}
                style={styles.modalButton}
              >
                <Icon name="fire" size={25} color="#ff5733" />
                <Text style={styles.modalButtonText}>Roast</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.modalCancelButton}>
                <Icon name="times" size={25} color="#dcdcdc" />
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )  
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 10
  },
  modalCancelButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dcdcdc',
  },
});


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
            <TouchableOpacity onPress={() => openDrawer()}>
              <Image style={{ flex: 1, paddingVertical:30,  height: 60, width: 60, borderRadius: 60 / 2 }}
                  source={{ uri: currentUser.userAvatarUrl}} />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 24, flex: 1, marginLeft: 40 }}>
                {currentUser.highScore} DAC
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