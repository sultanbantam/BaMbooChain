importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA9LcSM4BdF9jCeyzAMMO3aCXnfq11V4iE",
  authDomain: "bamboochain-official.firebaseapp.com",
  projectId: "bamboochain-official",
  storageBucket: "bamboochain-official.firebasestorage.app",
  messagingSenderId: "969704302314",
  appId: "1:969704302314:web:78083a2d6718c8aa23d993"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
