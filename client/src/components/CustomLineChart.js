import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const CustomLineChart = ({ data, title, description,yAxisSuffix, decimalPlaces}) => {  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingLeft: 20 }}>
        <Text
          style={{
            color: "#e6e7ec",
            fontSize: 20,
            fontWeight: "500",
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text style={{ color: "#9a9ba1", fontSize: 15, marginBottom: 20 }}>
            {description}
          </Text>
        )}
      </View>
      <View>
        <LineChart
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          yAxisSuffix={yAxisSuffix}
          data={data}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#1f2026",
            backgroundGradientFrom: "#1f2026",
            backgroundGradientTo: "#1f2026",
            fillShadowGradient: "#7262f8",
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(${154}, ${155}, ${161}, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(${154}, ${155}, ${161}, ${opacity})`,
            style: {
              borderRadius: 16,
              right: 0,
              paddingRight: 64,
            },
            decimalPlaces: decimalPlaces,
          }}
          fromZero
          bezier
        />
      </View>
    </View>
  );
};

export default CustomLineChart;