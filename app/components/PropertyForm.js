'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function PropertyForm({ property = null }) {
  const isEditMode = !!property;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || '',
    location: property?.location || 'lawgate',
    address: property?.address || '',
    locationMapUrl: property?.locationMapUrl || '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    squareFeet: property?.squareFeet || '',
    contactNumber: property?.contactNumber || '',
    images: property?.images || [''],
    featured: property?.featured || false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadingImages, setUploadingImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };
  
  const removeImageField = async (index) => {
    if (formData.images.length > 1) {
      const imageUrl = formData.images[index];
      
      try {
        // Extract public ID from Cloudinary URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        
        if (imageUrl.includes('res.cloudinary.com')) {
          await fetch(`/api/upload/${publicId}`, {
            method: 'DELETE'
          });
        }

        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages }));
      } catch (error) {
        console.error('Error deleting image:', error);
        setErrors(prev => ({
          ...prev,
          images: 'Failed to delete image from storage'
        }));
      }
    }
  };
  
  const uploadImageToServer = async (file, index) => {
    const uploadId = `${Date.now()}-${index}`;
    setUploadingImages(prev => [...prev, uploadId]);
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    try {
      // Save previous image URL for cleanup
      const previousImage = formData.images[index];
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Upload new image
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({ ...prev, [uploadId]: percentComplete }));
        }
      });
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open('POST', '/api/upload');
        
        xhr.onload = function() {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } else {
            let errorMsg = 'Upload failed';
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMsg = `Upload failed: ${errorResponse.error || errorMsg}`;
            } catch (e) {
              errorMsg = `Upload failed: ${xhr.statusText || 'Unknown error'}`;
            }
            console.error('Upload error:', errorMsg);
            reject(new Error(errorMsg));
          }
        };
        
        xhr.onerror = function() {
          console.error('Network error during upload');
          reject(new Error('Network error during upload. Please check your internet connection.'));
        };
        
        xhr.send(uploadFormData);
      });
      
      const imageUrl = await uploadPromise;
      handleImageChange(index, imageUrl);
      setUploadingImages(prev => prev.filter(id => id !== uploadId));

      // Clean up previous image if it was from Cloudinary
      if (previousImage && previousImage.includes('res.cloudinary.com')) {
        try {
          const publicId = previousImage.split('/').pop().split('.')[0];
          await fetch(`/api/upload/${publicId}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Error deleting previous image:', error);
        }
      }

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      setErrors(prev => ({ 
        ...prev, 
        images: `Image upload failed: ${error.message}` 
      }));
      setUploadingImages(prev => prev.filter(id => id.includes(`-${index}`)));
      return null;
    }
  };
  
  const handleFileSelect = useCallback((e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Reset error for this image index
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }

      // If this is a new empty field, add it to the form data
      if (index >= formData.images.length || !formData.images[index]) {
        setFormData(prev => {
          const newImages = [...prev.images];
          while (newImages.length <= index) {
            newImages.push('');
          }
          return { ...prev, images: newImages };
        });
      }

      uploadImageToServer(file, index);
    }
  }, [errors, formData.images]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Price must be positive';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
    if (isNaN(formData.bedrooms) || Number(formData.bedrooms) <= 0) newErrors.bedrooms = 'Bedrooms must be positive';
    if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
    if (isNaN(formData.bathrooms) || Number(formData.bathrooms) <= 0) newErrors.bathrooms = 'Bathrooms must be positive';
    if (!formData.squareFeet) newErrors.squareFeet = 'Square footage is required';
    if (isNaN(formData.squareFeet) || Number(formData.squareFeet) <= 0) newErrors.squareFeet = 'Square footage must be positive';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (formData.images.every(img => !img.trim())) newErrors.images = 'At least one image is required';
    if (uploadingImages.length > 0) newErrors.images = 'Please wait for uploads to complete';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const cleanedFormData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFeet: Number(formData.squareFeet),
        images: formData.images.filter(img => img.trim() !== '')
      };
      
      const url = isEditMode ? `/api/properties/${property._id}` : '/api/properties';
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedFormData)
      });
      
      const data = await response.json();
      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setSubmitError(data.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderUploadProgress = (uploadId) => {
    const progress = uploadProgress[uploadId] || 0;
    return (
      <div key={uploadId} className="w-full mt-2">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-blue-200">
                Uploading
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div 
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
            ></div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (INR)*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="1"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location*
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="lawgate">Lawgate</option>
            <option value="green-valley">Green Valley</option>
            <option value="highland-park">Highland Park</option>
          </select>
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address*
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>
      
      <div>
        <label htmlFor="locationMapUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Location Map URL
        </label>
        <input
          type="text"
          id="locationMapUrl"
          name="locationMapUrl"
          value={formData.locationMapUrl}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.locationMapUrl ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.locationMapUrl && <p className="mt-1 text-sm text-red-600">{errors.locationMapUrl}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms*
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.bedrooms ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
        </div>
        
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms*
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            min="1"
            step="0.5"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.bathrooms ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
        </div>
        
        <div>
          <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
            Square Feet*
          </label>
          <input
            type="number"
            id="squareFeet"
            name="squareFeet"
            value={formData.squareFeet}
            onChange={handleChange}
            min="1"
            step="1"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.squareFeet ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.squareFeet && <p className="mt-1 text-sm text-red-600">{errors.squareFeet}</p>}
        </div>
      </div>
      
      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number*
        </label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.contactNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images*
        </label>
        {formData.images.map((image, index) => (
          <div key={index} className="mb-4 border rounded-md p-4 bg-gray-50">
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className={`flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.images ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.images.length <= 1}
              >
                Remove
              </button>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, index)}
                    className="hidden"
                  />
                </label>
                
                {image && (
                  <span className="text-sm text-gray-600">
                    {image.includes('http') ? 'Image URL set' : 'No image set'}
                  </span>
                )}
              </div>
              
              {uploadingImages.map(id => {
                if (id.includes(`-${index}`)) {
                  return renderUploadProgress(id);
                }
                return null;
              })}
              
              {image && image.includes('http') && (
                <div className="mt-2">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="h-24 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          + Add Another Image
        </button>
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
          Feature this property on the homepage
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImages.length > 0}
          className="btn-primary flex items-center justify-center min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : uploadingImages.length > 0 ? (
            'Uploading...'
          ) : isEditMode ? (
            'Update Property'
          ) : (
            'Add Property'
          )}
        </button>
      </div>
    </form>
  );
}
