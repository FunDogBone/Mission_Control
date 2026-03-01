import './globals.css'

export const metadata = {
  title: 'The Bloc',
  description: 'SpinTheBloc HQ',
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
