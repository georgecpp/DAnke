import React, {useContext, useEffect} from "react";
import { Text, View, Dimensions, ScrollView, Alert } from "react-native";
import { BASE_URL } from "../utils/config";
import CustomLineChart from "./CustomLineChart";
import { AuthContext } from "../context/AuthContext";
import moment from 'moment';
const { width } = Dimensions.get("screen");

const RewardTracker = () => {
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
  const rewardData = {
    labels: lastWeekLabels,
    datasets: [
      {
        data: [0.12,0.15,0.00,0.03,0.10,0.05,0.00],
        baseline: 0.05
      }
    ]
  };

  const {userInfo} = useContext(AuthContext);
  return (
    <View style={{flex: 1, marginTop: 20}}>
        <CustomLineChart
          title={"Rewards"}
          description={"DAC reward tracking"}
          data={rewardData}
          decimalPlaces={2}
        />
    </View>
  )
}

export default RewardTracker;