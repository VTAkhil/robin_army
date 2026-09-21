importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
     apiKey: "AIzaSyCp-zEiRDKHH46yIPlHeF0xK1F7Yc4E16k",
     authDomain: "robinarmy-42918.firebaseapp.com",
     projectId: "robinarmy-42918",
     storageBucket: "robinarmy-42918.firebasestorage.app",
     messagingSenderId: "734344289873",
     appId: "1:734344289873:web:377a9fb01d602c18f2e270",
});


const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.score
              };
            return registration.showNotification(title, options);
        });
    return promiseChain;
});
self.addEventListener('notificationclick', function (event) {
    console.log('notification received: ', event)
});