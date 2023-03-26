import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

const getIconNameOnReactType = (reactType) => {
  if(reactType === 'like') {
    return "thumbs-up";
  }
  else if(reactType === 'congrats') {
    return "trophy";
  }
  else {
    return "fire";
  }
}
const getIconColorOnReactType = (reactType) => {
  if(reactType === 'like') {
    return "#3b5998";
  }
  else if(reactType === 'congrats') {
    return "#ffcc00";
  }
  else {
    return "#ff5733";
  }
}
const ReactDisplay = ({ react }) => {
  const { userFromName, userFromImage, reactType, savedAtDate } = react;

  // Calculate the time difference between now and the savedAtDate timestamp
  const timeAgo = moment(savedAtDate).fromNow();

  return (
    <View style={styles.container}>
      <Image source={{ uri: userFromImage }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{userFromName}</Text>
        <View style={styles.reactContainer}>
          <Text style={styles.timestamp}>{timeAgo}</Text>
        </View>
      </View>
      <Icon name={getIconNameOnReactType(reactType)} size={25} color={getIconColorOnReactType(reactType)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
  },
  reactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  react: {
    fontSize: 14,
    marginRight: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ReactDisplay;
