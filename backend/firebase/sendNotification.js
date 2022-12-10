const dotenv = require('dotenv');
var admin = require("firebase-admin");
var serviceAccount = require("./connexio-3d4de-firebase-adminsdk-85o5h-6b8ee1905d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
dotenv.config();

module.exports = function(fcmRegistrationTokens, title, body, priority) {

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