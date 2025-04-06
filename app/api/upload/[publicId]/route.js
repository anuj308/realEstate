import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function DELETE(request, { params }) {
  try {
    const { publicId } = params;

    if (!publicId) {
      return Response.json(
        { error: 'Missing publicId parameter' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'not found') {
      return Response.json(
        { error: 'Image not found in Cloudinary' },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return Response.json(
      { 
        error: 'Failed to delete image',
        details: error.message
      },
      { status: 500 }
    );
  }
}
