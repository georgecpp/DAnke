import React, {useContext, useEffect} from "react";
import { Text, View, Dimensions, ScrollView, Alert } from "react-native";
import FitImage from "./FitImage";
import { AuthContext } from "../context/AuthContext";
import FitHealthStat from "./FitHealthStat";
import moment from 'moment';
import { convertMsToHoursMinutes } from "../utils/DateOps";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import CustomLineChart from "./CustomLineChart";

const { width } = Dimensions.get("screen");

const GoogleFitComponent = ({weeklySteps,heartRate,weeklySleep}) => {

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

  const sleepData = {
  labels: lastWeekLabels,
  datasets: [
    {
      data: weeklySleep,
      baseline: 8
    }
  ]
};

const stepsData = {
  labels: lastWeekLabels,
  datasets: [
    {
      data: weeklySteps,
      baseline: 10000
    }
  ]
};

const {userInfo} = useContext(AuthContext);

const sendVitals = async () => {
  axios.post(`${BASE_URL}/vitals/saveVitals`, {
            userId: userInfo.data.id,
            steps: weeklySteps[weeklySteps.length - 1],
            heartRateAvg: heartRate,
            sleep: convertMsToHoursMinutes(weeklySleep[weeklySleep.length - 1] * (1000 * 60 * 60)),
            savedAtDate: currentDate
        })
        .then(res => {
          if(res.status !== 200) {
            Alert.alert('Vitals not sent correctly: ' + res.statusText);
          }
        })
        .catch(e => {
            Alert.alert(`Vitals send error: ${e}`);
        });
}

useEffect(() => {
  sendVitals();
}, []);

  return (
    <ScrollView style={{ backgroundColor: "#1f2026" }}>
      <View style={{justifyContent: 'space-evenly'}}>
        <FitImage/>
        <Text style={{fontSize: 20, fontFamily: 'Roboto-Medium', alignSelf: 'center', color: 'white', paddingBottom: 0}}>
        🚀 {userInfo.data.name}, today
        </Text>
      </View>
      <View
       style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginLeft: width * 0.1,
        marginRight: width * 0.1,
        marginBottom: width * 0.05,
        marginTop: width * 0.05
      }}
      >
        <FitHealthStat
          title="Heart Rate"
          icon="heart-pulse"
          iconColor="#e31b23"
          value={heartRate+" bpm"}
        />
        <FitHealthStat
          title="Steps"
          icon="walk"
          iconColor="#E8BEAC"
          value={weeklySteps[weeklySteps.length - 1]}
        />
        <FitHealthStat
          title="Sleep"
          icon="sleep"
          iconColor="#4579ac"
          value={convertMsToHoursMinutes(weeklySleep[weeklySleep.length - 1] * (1000 * 60 * 60))}
        />
      </View>
      <View>
        <CustomLineChart
          title={"Sleep"}
          description={`${convertMsToHoursMinutes(weeklySleep[weeklySleep.length - 1] * (1000 * 60 * 60))} • Yesterday`}
          data={sleepData}
          yAxisSuffix={"h"}
          decimalPlaces={0}
        />
        <CustomLineChart
          title={"Steps"}
          description={"Take 10,000 steps a day"}
          data={stepsData}
          decimalPlaces={0}
        />
      </View>
    </ScrollView>
  );
};

export default GoogleFitComponent;