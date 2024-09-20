self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.notification.body,
        image: data.notification.image,
        vibrate: data.notification.vibrate,
        data: {
            url: data.notification.data.url
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.notification.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Cerrar la notificación al hacer clic

    const notificationData = event.notification.data;
    
    if (notificationData && notificationData.url) {
        event.waitUntil(
            clients.openWindow(notificationData.url) // Redirige a la URL de la imagen o sitio
        );
    } else {
        console.log('Error');
      }
});
