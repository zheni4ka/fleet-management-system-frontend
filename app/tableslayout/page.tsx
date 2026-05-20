import Link from 'next/link'
export default async function Page() {
  return (
    <html>
      <body>
        <nav>
          <Link href="/driver">Driver</Link>
          <Link href="/auto">Auto</Link>
          <Link href="/route">Route</Link>
        </nav>
        </body>
    </html>
  )
}