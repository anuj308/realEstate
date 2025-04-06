'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function HomePageContent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('all');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get location from URL or use 'all'
    const locationParam = searchParams.get('location') || 'all';
    setLocation(locationParam);
    
    // Fetch properties
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const url = locationParam === 'all' 
          ? '/api/properties' 
          : `/api/properties?location=${locationParam}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setProperties(data);
        } else {
          console.error('Failed to fetch properties:', data.message);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // For demo purposes until we have real data
  const demoProperties = [
    {
      _id: '1',
      title: 'Luxury Villa with Pool',
      description: 'Beautiful luxury villa with 4 bedrooms, private pool, and stunning views of the mountains.',
      price: 750000,
      location: 'lawgate',
      address: '123 Luxury Lane, Lawgate',
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 3200,
      images: ['/images/placeholder-property.jpg'],
      contactNumber: '(123) 456-7890',
      featured: true
    },
    {
      _id: '2',
      title: 'Modern Downtown Apartment',
      description: 'Contemporary 2-bedroom apartment in the heart of Green Valley with city views and modern amenities.',
      price: 350000,
      location: 'green-valley',
      address: '456 Urban Ave, Green Valley',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      images: ['/images/placeholder-property.jpg'],
      contactNumber: '(123) 456-7890',
      featured: false
    },
    {
      _id: '3',
      title: 'Family Home with Garden',
      description: 'Spacious family home with a beautiful garden, 3 bedrooms, and a newly renovated kitchen.',
      price: 450000,
      location: 'highland-park',
      address: '789 Family Circle, Highland Park',
      bedrooms: 3,
      bathrooms: 2.5,
      squareFeet: 2100,
      images: ['/images/placeholder-property.jpg'],
      contactNumber: '(123) 456-7890',
      featured: true
    }
  ];

  const displayProperties = properties.length > 0 ? properties : demoProperties;
  const filteredProperties = location === 'all' 
    ? displayProperties 
    : displayProperties.filter(prop => prop.location === location);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px]">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-full w-full">
            <Image
              src="/images/hero-image.jpg"
              alt="Beautiful homes"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl mb-8">
              Discover exclusive properties in Lawgate, Green Valley, and Highland Park
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/?location=lawgate" 
                className={`btn-primary ${location === 'lawgate' ? 'bg-blue-700' : ''}`}
              >
                Lawgate
              </a>
              <a 
                href="/?location=green-valley" 
                className={`btn-primary ${location === 'green-valley' ? 'bg-blue-700' : ''}`}
              >
                Green Valley
              </a>
              <a 
                href="/?location=highland-park" 
                className={`btn-primary ${location === 'highland-park' ? 'bg-blue-700' : ''}`}
              >
                Highland Park
              </a>
              <a 
                href="/" 
                className={`btn-primary ${location === 'all' ? 'bg-blue-700' : ''}`}
              >
                View All
              </a>
            </div>
          </div>
        </section>
        
        {/* Properties Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              {location === 'all' 
                ? 'Featured Properties' 
                : `Properties in ${location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600">No properties found in this location.</h3>
                <p className="mt-2">Please check back later or browse other locations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 px-4 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Exclusive Properties</h3>
                <p className="text-gray-600">Access to exclusive listings in prime locations that you won't find anywhere else.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Advisors</h3>
                <p className="text-gray-600">Our team of experienced real estate professionals is ready to assist you every step of the way.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-600">We ensure all property transactions are secure, transparent, and hassle-free.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
