export const metadata = {
  title: 'Lager API - Invitasjonssystem',
  description: 'Send invitasjoner til Personlig Lager',
}

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
