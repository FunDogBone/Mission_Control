import './globals.css'

export const metadata = {
  title: 'Mission Control',
  description: 'SpinTheBloc Mission Control',
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
