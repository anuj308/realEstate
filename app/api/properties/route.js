import dbConnect from '../../lib/mongodb';
import Property from '../../models/Property';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get query params
    const url = new URL(request.url);
    const location = url.searchParams.get('location');
    
    // Build filter
    const filter = location ? { location } : {};
    
    // Get properties
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    
    return Response.json(properties, { status: 200 });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return Response.json({ message: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get request body
    const body = await request.json();
    
    // Create new property
    const property = await Property.create(body);
    
    return Response.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return Response.json({ message: 'Failed to create property', error: error.message }, { status: 500 });
  }
}