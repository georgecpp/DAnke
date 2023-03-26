import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import ReactDisplay from '../components/ReactDisplay';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";

const ReactsScreen = ({navigation}) => {

  const {userInfo} = useContext(AuthContext);
  const [userReacts, setUserReacts] = useState([]);

  const getUserReacts = async () => {
    const userReactsResponse = await axios.get(
      `http://3.69.101.106:2409/reacts/userReacts/${userInfo.data.id}?lastNdays=7`
    );
    const lastWeekReacts = userReactsResponse.data;
    if(lastWeekReacts.length === 0) {
      setUserReacts([null]);
      return;
    }
    setUserReacts(lastWeekReacts);
  }

  useEffect(() => {
    getUserReacts();
  }, [userReacts]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#1f2026'}}>
      <ScrollView style={{padding: 20, paddingVertical: 0}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center', margin:20, paddingTop:40, color: '#fff'}}>Your friends on you 👻</Text>
          <TouchableOpacity style={{padding:20}} onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={{uri:userInfo.data.photo}}
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
            />
          </TouchableOpacity>
        </View>
        {userReacts.length > 0 ?
          userReacts.map((item)=> <ReactDisplay key={item._id} react={item}/>)
          :
          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        }
      </ScrollView>
  </SafeAreaView>
  )
}
export default ReactsScreen;