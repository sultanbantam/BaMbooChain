self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const title = data.title || 'BaMbooChain Notifikasi';
      const options = {
        body: data.body || 'Anda mendapat pesan baru',
        icon: data.icon || '/logos/bmc.png',
        badge: data.badge || '/logos/bmc.png',
        data: {
          url: data.url || '/'
        }
      };
      
      event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
      console.error('Push event data parsing failed', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});
