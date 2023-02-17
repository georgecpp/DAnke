import React, {useContext} from "react";
import { Text, View, Dimensions, ScrollView } from "react-native";
import FitChart from "./FitChart";
import FitImage from "./FitImage";
import { AuthContext } from "../context/AuthContext";

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
      <View>
        <FitImage/>
        <Text style={{fontSize: 20, fontFamily: 'Roboto-Medium', alignSelf: 'center', color: 'white'}}>
        👋 Yello, {userInfo.data.name}!
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginLeft: width * 0.15,
          marginRight: width * 0.15,
          marginBottom: width * 0.05,
        }}
      >
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