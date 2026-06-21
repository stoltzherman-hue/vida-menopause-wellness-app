self.addEventListener('push', (event) => {
  if (!event.data) return
  let payload
  try { payload = event.data.json() } catch { payload = { title: 'Vida', body: event.data.text() } }

  const title = payload.title ?? 'Vida'
  const options = {
    body: payload.body ?? '',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: payload.tag ?? 'vida-notification',
    data: payload.url ? { url: payload.url } : undefined,
    requireInteraction: payload.requireInteraction ?? false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
