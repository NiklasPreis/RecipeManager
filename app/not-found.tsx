import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-4xl font-bold text-gray-300 mb-2">404</h2>
      <p className="text-gray-500 mb-6">Seite nicht gefunden.</p>
      <Link href="/" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
        Zurück zur Übersicht
      </Link>
    </div>
  )
}
