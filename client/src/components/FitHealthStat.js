import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FitHealthStat = ({title,icon, iconColor, value}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <View
        style={{
          width: 35,
          height: 35,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
      <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons name={icon} size={33} color={iconColor} />
      </View>
      </View>
      <View
            style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            }}
        >
        <Text style={{ color: "#9a9ba1", fontSize: 15, fontWeight: "500" }}>{title}</Text>
        <Text style={{ color: "#e9eaee", fontSize: 15, fontWeight: "500" }}>{value}</Text>
     </View>
    </View>
  );
};

export default FitHealthStat;