const dotenv = require('dotenv');
var admin = require("firebase-admin");
var serviceAccount = require("./danke-a8686-firebase-adminsdk-p0s3j-45cea33637.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
dotenv.config();

module.exports = function(fcmRegistrationTokens, title, body, imageUrl) {

    const data = {
      message: {
        notification: {
          title: title,
          body: body
        },
        android: {
          notification: {
            color: '#2D5987',
            imageUrl: imageUrl
          }
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcm_options: {
            image: imageUrl
          }
        },
        webpush: {
          headers: {
            image: imageUrl
          }
        },
        tokens: fcmRegistrationTokens
      }
    };  
    admin.messaging().sendMulticast(data.message);
}