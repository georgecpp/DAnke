const dotenv = require('dotenv');
var admin = require("firebase-admin");
var serviceAccount = require("./danke-a8686-firebase-adminsdk-p0s3j-45cea33637.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
dotenv.config();

module.exports = function(fcmRegistrationTokens, title, body) {

    const data = {
      message: {
        notification: {
          title: title,
          body: body
        },
        android: {
          notification: {
            color: '#2D5987',
            imageUrl: 'https://www.navy.ro/images/SiglaSMFN.jpg'
          }
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcm_options: {
            image: 'https://www.navy.ro/images/SiglaSMFN.jpg'
          }
        },
        webpush: {
          headers: {
            image: 'https://www.navy.ro/images/SiglaSMFN.jpg'
          }
        },
        tokens: fcmRegistrationTokens
      }
    };  
    admin.messaging().sendMulticast(data.message);
}