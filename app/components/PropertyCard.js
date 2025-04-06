import Image from 'next/image';
import Link from 'next/link';

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <div className="relative h-48 w-full">
        <Image 
          src={property.images[0] || '/images/placeholder-property.jpg'} 
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
        {property.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
            +{property.images.length - 1} more
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h3>
          <span className="bg-accent text-white px-2 py-1 rounded text-sm font-bold">
            ₹{property.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">{property.location}</p>
        
        <div className="flex items-center text-gray-700 mb-4 text-sm">
          <div className="flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{property.bathrooms} baths</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
        
        <Link href={`/property/${property._id}`} 
          className="btn-primary inline-block w-full text-center">
          View Details
        </Link>
      </div>
    </div>
  );
}
