import dbConnect from '../../../lib/mongodb';
import Property from '../../../models/Property';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Get property by ID
    const { id } = params;
    const property = await Property.findById(id);
    
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    
    return Response.json(property, { status: 200 });
  } catch (error) {
    console.error('Error fetching property:', error);
    return Response.json({ message: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // Get request body
    const body = await request.json();
    
    // Update property
    const property = await Property.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    
    return Response.json(property, { status: 200 });
  } catch (error) {
    console.error('Error updating property:', error);
    return Response.json({ message: 'Failed to update property', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // Delete property
    const property = await Property.findByIdAndDelete(params.id);
    
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return Response.json({ message: 'Failed to delete property' }, { status: 500 });
  }
}
