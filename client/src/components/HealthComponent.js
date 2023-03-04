import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator
} from 'react-native';

import GoogleFit, {Scopes} from 'react-native-google-fit';
import GoogleFitComponent from './GoogleFitComponent';
import { convertMsToHoursMinutes } from '../utils/DateOps';

const HealthComponent = ({navigation}) => {

  var [weeklySteps, setWeeklySteps] = useState([]);
  var [weeklySleep, setWeeklySleep] = useState([]);
  var [heartRate, setHeartRate] = useState(0);

  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_HEART_RATE_READ,
      Scopes.FITNESS_SLEEP_READ,
    ],
  };

  var today = new Date();
    var lastWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7,
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
          if(data.length !== 0) {
            var stepsInLastWeek = [];
            data.map((element) => {
              stepsInLastWeek.push(element.value);
            })
            stepsInLastWeek.pop();
            stepsInLastWeek.reverse();
            setWeeklySteps(stepsInLastWeek);
          }
          else {
            setDailySteps(-1);
          }
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

  // Retrieve the sleep data from Google Fit
  GoogleFit.getSleepSamples(opt)
    .then((res) => {
      // Parse the sleep data and format it as DAY-SLEEP_DURATION
      var currStart = res[0].startDate;
      const sleepData = res.map((sleep) => {
        var duration = 0;
        if(Date.parse(currStart) - Date.parse(sleep.startDate) > 0) {
          currStart = sleep.startDate;
          return duration.toFixed(2);
        }
        duration = (Date.parse(sleep.endDate) - Date.parse(sleep.startDate)) / (1000 * 60 * 60);
        currStart = sleep.startDate;
        return duration.toFixed(2);
      })
      .filter((sleepDuration) => {
        return sleepDuration !== "0.00";
      });

      if(sleepData.length>7) sleepData.shift();
      const padLen = 7 - sleepData.length;
      for(i=0;i<padLen;i++) {
        sleepData.unshift('0.00');
      }
      setWeeklySleep(sleepData);
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  let getAllDataFromAndroid = () => {
  
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      if (authorized) {
        // if already authorized, fetch data
        console.log('already AUTH_SUCCESS');
        fetchStepsData(opt);
        fetchHeartData(opt);
        fetchSleepData(opt);
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
      {weeklySteps.length !== 0 ?
      <GoogleFitComponent navigation={navigation} weeklySteps={weeklySteps} heartRate={heartRate} weeklySleep={weeklySleep}/>
        : 
      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
      }
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