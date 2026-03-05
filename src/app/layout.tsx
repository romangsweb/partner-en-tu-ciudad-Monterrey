import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Xamai | SAP Partner Monterrey - Transformación Continua',
  description: 'Acompañamos a las empresas medianas en Monterrey a evolucionar su negocio, no solo a implementar software. Somos Gold Partner de SAP con más de 26 años de experiencia.',
  keywords: 'SAP Monterrey, Partner SAP Monterrey, Xamai Monterrey, SAP S/4HANA Monterrey, SAP Business One, Transformación Digital, Clean Core',
  openGraph: {
    title: 'Xamai | SAP Partner Monterrey - Transformación Continua',
    description: 'La transformación de tu negocio no termina en el Go-Live. Apenas empieza. Somos el socio estratégico para el mid-market en Nuevo León.',
    type: 'website',
    locale: 'es_MX',
    url: 'https://xamai.com/partner-sap/monterrey'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
