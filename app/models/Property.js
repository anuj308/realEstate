import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the property'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for the property']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for the property']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for the property'],
    enum: {
      values: ['lawgate', 'green-valley', 'highland-park'],
      message: '{VALUE} is not a valid location'
    }
  },
  address: {
    type: String,
    required: [true, 'Please provide an address for the property']
  },
  locationMapUrl: {
    type: String,
    required: false,
    default: '',
    description: 'Google Maps URL to the property location'
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide the number of bedrooms'],
    min: [1, 'Property must have at least 1 bedroom']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide the number of bathrooms'],
    min: [1, 'Property must have at least 1 bathroom']
  },
  squareFeet: {
    type: Number,
    required: [true, 'Please provide the square footage']
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image']
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide a contact number']
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);