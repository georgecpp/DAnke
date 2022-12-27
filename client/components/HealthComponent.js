import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import GoogleFit, {Scopes} from 'react-native-google-fit';


const HealthComponent = () => {

  var [dailySteps, setDailySteps] = useState(0);
  var [heartRate, setHeartRate] = useState(0);
  var [sleep, setSleep] = useState(0);
  var [oxygenSaturation, setOxygenSaturation] = useState(0);
  var [bodyTemperature, setBodyTemperature] = useState(0);

  var [loading, setLoading] = useState(true);

  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_HEART_RATE_READ,
      Scopes.FITNESS_HEART_RATE_WRITE,
      Scopes.FITNESS_BODY_TEMPERATURE_READ,
      Scopes.FITNESS_BODY_TEMPERATURE_WRITE,
      Scopes.FITNESS_SLEEP_READ,
      Scopes.FITNESS_OXYGEN_SATURATION_READ,
      Scopes.FITNESS_OXYGEN_SATURATION_WRITE,
    ],
  };

  var today = new Date();
    var lastWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 8,
    );
    const opt = {
      startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(), // required ISO8601Timestamp
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };

  // methods to retrieve reference data
  
  let fetchStepsData = async opt => {
    const res = await GoogleFit.getDailyStepCountSamples(opt);
    if (res.length !== 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].source === 'com.google.android.gms:estimated_steps') {
          let data = res[i].steps.reverse();
          dailyStepCount = res[i].steps;
          setDailySteps(data[0].value);
        }
      }
    } else {
      console.log('Not Found');
    }
  };

  let fetchHeartData = async opt => {
    const res = await GoogleFit.getHeartRateSamples(opt);
    let data = res.reverse();
    if (data.length === 0) {
      setHeartRate('Not Found');
    } else {
      setHeartRate(data[0].value);
    }
  };

  let fetchSleepData = async opt => {
    var midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    let sleepTotal = 0;
    const res = await GoogleFit.getSleepSamples(opt);
    if(res.length === 0) {
      setSleep(-1);
      return;
    }
 
    for (var i = 0; i < res.length; i++) {
      if (new Date(res[i].endDate) > Date.parse(midnight)) {
        if (new Date(res[i].startDate) > Date.parse(midnight)) {
          sleepTotal +=
            Date.parse(res[i].endDate) - Date.parse(res[i].startDate);
        } else {
          sleepTotal += Date.parse(res[i].endDate) - Date.parse(midnight);
        }
        if (
          i + 1 < res.length &&
          Date.parse(res[i].startDate) < Date.parse(res[i + 1].endDate)
        ) {
          sleepTotal -=
            Date.parse(res[i + 1].endDate) - Date.parse(res[i].startDate);
        }
      }
    }
    setSleep(Math.round((sleepTotal / (1000 * 60 * 60)) * 100) / 100);
  };

  let fetchOxygenSaturationData = async opt => {
    const res = await GoogleFit.getOxygenSaturationSamples(opt);
    const data = res.reverse();
    if(data.length === 0) {
      setOxygenSaturation(-1);
    }
    else {
      setOxygenSaturation(data[0].value);
    }
  }

  let fetchBodyTemperatureData = async opt => {
    const res = await GoogleFit.getBodyTemperatureSamples(opt);
    const data = res.reverse();
    if(data.length === 0) {
      setBodyTemperature(-1);
    }
    else {
      setBodyTemperature(data[0].value);
    }
  }
  
  let getAllDataFromAndroid = () => {
  
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      if (authorized) {
        // if already authorized, fetch data
        fetchStepsData(opt);
        fetchHeartData(opt);
        fetchSleepData(opt);
        fetchOxygenSaturationData(opt);
        fetchBodyTemperatureData(opt);
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');
              // if successfully authorized, fetch data
              fetchStepsData(opt);
              fetchHeartData(opt);
              fetchSleepData(opt);
              fetchOxygenSaturationData(opt);
              fetchBodyTemperatureData(opt);
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch(() => {
            dispatch('AUTH_ERROR');
          });
      }
    });
  }

  useEffect(() => {
    getAllDataFromAndroid();
  }, []);

  return (
    <View style={[{flex: 1}]}>
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Step Count - Today</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{dailySteps}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Heart Rate</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{heartRate}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Sleep - Today</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{sleep} hours</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Oxygen Saturation</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{oxygenSaturation}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Body Temperature</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{bodyTemperature}</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 30,
    margin: 10,
    marginTop: 12,
  },
  rowBlue: {
    padding: 2,
  },
  row_1: {
    flex: 1,
  },
  row_2: {
    flex: 2,
  },
  containerBlue: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#187FA1',
    color: 'white',
  },
  containerWhite: {
    marginTop: 10,
    height: 50,
    backgroundColor: 'white',
    color: '#187FA1',
  },
  textContainerBlue: {
    paddingTop: 15,
    paddingLeft: 15,
    color: 'white',
  },
  textContainerWhite: {
    paddingTop: 15,
    paddingLeft: 70,
    color: '#187FA1',
  },
});

export default HealthComponent