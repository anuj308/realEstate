import { v2 as cloudinary } from 'cloudinary';


// Debug log env vars
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '****'+process.env.CLOUDINARY_API_KEY.slice(-4) : 'not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '****'+process.env.CLOUDINARY_API_SECRET.slice(-4) : 'not set'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    // Verify Cloudinary is properly configured
    const requiredEnvVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY', 
      'CLOUDINARY_API_SECRET'
    ];
    
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length) {
      throw new Error(`Missing Cloudinary config: ${missingVars.join(', ')}`);
    }

    // Upload to Cloudinary using API secret for signing
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'real_estate',
          use_filename: true,
          unique_filename: false,
          overwrite: true
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(bytes);
    });

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      cloudinaryError: error.response?.body
    });
    return Response.json(
      { 
        error: 'Failed to upload image',
        details: error.message,
        cloudinaryError: error.response?.body 
      },
      { status: 500 }
    );
  }
}
