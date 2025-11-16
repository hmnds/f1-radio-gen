import './globals.css'

export const metadata = {
  title: 'F1 Radio Generator',
  description: 'Generate realistic F1 driver-engineer radio exchanges',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
