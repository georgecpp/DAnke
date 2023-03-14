import React, {useContext, useEffect, useState} from "react";
import { Text, View, Dimensions, ScrollView, Alert, ActivityIndicator} from "react-native";
import { BASE_URL } from "../utils/config";
import CustomLineChart from "./CustomLineChart";
import { AuthContext } from "../context/AuthContext";
import moment from 'moment';
import axios from "axios";
const { width } = Dimensions.get("screen");

const RewardTracker = () => {

  const {userInfo} = useContext(AuthContext);
  const [userRewards, setUserRewards] = useState([]);
  // Get the current date
  const currentDate = moment();

  // Initialize an empty array to store the labels
  const lastWeekLabels = [];

  // Loop through the last 7 days
  for (let i = 6; i >= 0; i--) {
    // Subtract i days from the current date
    const date = moment(currentDate).subtract(i, 'days');

    // Get the day of the week as a string (e.g. "Monday")
    const dayOfWeek = date.format('ddd');

    // Add the day of the week to the labels array
    lastWeekLabels.push(dayOfWeek);
  }

  const getUserRewards = async () => {
    const userRewardsResponse = await axios.get(
      `http://3.69.101.106:2409/reward/userRewards/${userInfo.data.id}?lastNdays=6`
    );
    const lastWeekRewards = userRewardsResponse.data;
    var lastWeekRewardData = lastWeekRewards.map((reward) => {
      return reward.rewardDAC;
    });
    lastWeekRewardData = lastWeekRewardData.reverse();
    if(lastWeekRewards.length === 0) {
      setUserRewards([0.00,0.00,0.00,0.00,0.00,0.00,0.00]);
      return;
    }
    var lastWeekRewardsPadLen = 7-lastWeekRewards.length;
    for(i=0;i<lastWeekRewardsPadLen;i++) {
      lastWeekRewardData.push(0.00);
    }
    setUserRewards(lastWeekRewardData);
  }
  
  useEffect(() => {
    getUserRewards();
  }, []);

  const rewardData = {
    labels: lastWeekLabels,
    datasets: [
      {
        data: userRewards,
        baseline: 0.05
      }
    ]
  };
  return (
    <View style={{flex: 1, marginTop: 20}}>
      {userRewards.length !== 0 ?
        <CustomLineChart
          title={"Rewards"}
          description={"DAC reward tracking"}
          data={rewardData}
          decimalPlaces={2}
        /> :
        <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      }
    </View>
  )
}

export default RewardTracker;