import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Dream Homes
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-700 hover:text-primary transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/?location=lawgate" className="text-gray-700 hover:text-primary transition">
                Lawgate
              </Link>
            </li>
            <li>
              <Link href="/?location=green-valley" className="text-gray-700 hover:text-primary transition">
                Green Valley
              </Link>
            </li>
            <li>
              <Link href="/?location=near-lpu" className="text-gray-700 hover:text-primary transition">
                Near LPU
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}