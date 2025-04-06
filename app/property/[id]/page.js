'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useParams } from 'next/navigation';

export default function PropertyDetail() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  const params = useParams();
  const { id } = params;
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setProperty(data);
        } else {
          setError('Failed to fetch property details');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProperty();
    }
  }, [id]);
  
  // For demo purposes until we have real data
  const demoProperty = {
    _id: id,
    title: 'Luxury Villa with Pool',
    description: 'This beautiful luxury villa offers spacious living with 4 bedrooms, private pool, and stunning views of the mountains. The property features high-end finishes, an open floor plan, and modern amenities throughout. The kitchen is equipped with top-of-the-line appliances and granite countertops. The master suite includes a large walk-in closet and an ensuite bathroom with a soaking tub and separate shower.\n\nOutside, you\'ll find a meticulously landscaped yard with a private pool, patio area, and outdoor kitchen - perfect for entertaining. The property is located in a quiet, exclusive neighborhood with easy access to shopping, dining, and recreational facilities.',
    price: 750000,
    location: 'lawgate',
    address: '123 Luxury Lane, Lawgate',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3200,
    images: ['/images/placeholder-property.jpg', '/images/placeholder-property.jpg', '/images/placeholder-property.jpg'],
    contactNumber: '(123) 456-7890',
    featured: true
  };
  
  const displayProperty = property || demoProperty;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-600 hover:text-primary">
            Home
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link 
            href={`/?location=${displayProperty.location}`} 
            className="text-gray-600 hover:text-primary"
          >
            {displayProperty.location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-800">{displayProperty.title}</span>
        </div>
        
        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image 
                src={displayProperty.images[activeImage] || '/images/placeholder-property.jpg'} 
                alt={displayProperty.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            {/* Image Navigation */}
            {displayProperty.images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? displayProperty.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === displayProperty.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Thumbnail Preview */}
            {displayProperty.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {displayProperty.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      activeImage === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Property Information */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayProperty.title}</h1>
                <p className="text-gray-600 text-lg">{displayProperty.address}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-3xl font-bold text-primary">₹{displayProperty.price.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Property Features */}
            <div className="flex flex-wrap gap-6 mb-8 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-700">{displayProperty.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">{displayProperty.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span className="text-gray-700">{displayProperty.squareFeet.toLocaleString()} sq ft</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 capitalize">
                  {displayProperty.location.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div className="text-gray-700 space-y-4">
                {displayProperty.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">{displayProperty.contactNumber}</span>
              </div>
              <a 
                href={`tel:${displayProperty.contactNumber.replace(/\D/g, '')}`}
                className="btn-primary inline-block text-center w-full md:w-auto"
              >
                Call Agent
              </a>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="mt-8">
          <Link 
            href="/"
            className="flex items-center text-primary hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Properties
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}