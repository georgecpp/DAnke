import React, {useContext} from "react";
import { Text, View, Dimensions, ScrollView } from "react-native";
import FitChart from "./FitChart";
import FitImage from "./FitImage";
import { AuthContext } from "../context/AuthContext";
import FitHealthStat from "./FitHealthStat";

const { width } = Dimensions.get("screen");
const sleepData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [9, 6, 6.5, 8, 6, 7, 9],
      baseline: 8
    }
  ]
};

const stepsData = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [10000, 9000, 2000, 3000, 8000, 11000, 10500, 1000],
      baseline: 10000
    }
  ]
};

const GoogleFitComponent = () => {

  const {userInfo} = useContext(AuthContext);
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
          value="83 bpm"
        />
        <FitHealthStat
          title="Steps"
          icon="walk"
          iconColor="#E8BEAC"
          value="5000"
        />
        <FitHealthStat
          title="Sleep"
          icon="sleep"
          iconColor="#4579ac"
          value="7h 48m"
        />
      </View>
      <View>
        <FitChart
          title={"Sleep"}
          description={"7h 48m • Yesterday"}
          data={sleepData}
          baseline={8}
        />
        <FitChart
          title={"Take 10,000 steps a day"}
          data={stepsData}
          baseline={10000}
        />
      </View>
    </ScrollView>
  );
};

export default GoogleFitComponent;