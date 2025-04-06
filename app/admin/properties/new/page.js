'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PropertyForm from '../../../components/PropertyForm';
import Link from 'next/link';

export default function AddProperty() {
  const { status } = useSession();
  const router = useRouter();
  
  // Check if user is authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">Add New Property</h1>
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
          <span className="text-gray-800">Add Property</span>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <PropertyForm />
        </div>
      </main>
    </div>
  );
}