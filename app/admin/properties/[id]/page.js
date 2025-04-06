'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PropertyForm from '../../../components/PropertyForm';
import Link from 'next/link';

export default function EditProperty() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch property data
  useEffect(() => {
    if (status === 'authenticated' && params?.id) {
      const fetchProperty = async () => {
        try {
          const res = await fetch(`/api/properties/${params.id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch property');
          }
          const data = await res.json();
          setProperty(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [status, params?.id]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">Edit Property</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6">
          <Link href="/" className="text-gray-600 hover:text-primary">
            Home
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary">
            Admin Dashboard
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-800">Edit Property</span>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {property ? (
            <PropertyForm property={property} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Property not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
