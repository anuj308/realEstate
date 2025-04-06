import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Dream Homes</h3>
            <p className="text-gray-300">
              Find your perfect property in Lawgate, Green Valley, and Highland Park with our exclusive listings.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?location=lawgate" className="text-gray-300 hover:text-white transition">
                  Lawgate Properties
                </Link>
              </li>
              <li>
                <Link href="/?location=green-valley" className="text-gray-300 hover:text-white transition">
                  Green Valley Properties
                </Link>
              </li>
              <li>
                <Link href="/?location=highland-park" className="text-gray-300 hover:text-white transition">
                  Highland Park Properties
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-300 not-italic">
              <p>123 Real Estate Street</p>
              <p>Dream City, DC 12345</p>
              <p className="mt-2">Email: info@dreamhomes.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dream Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}