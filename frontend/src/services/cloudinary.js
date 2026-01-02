/**
 * Cloudinary Image Upload Service
 * 
 * Instructions:
 * 1. Create a free account at https://cloudinary.com/
 * 2. Get your 'Cloud Name' and 'Upload Preset' (Settings > Upload > Upload presets > Add upload preset > Signing Mode: Unsigned)
 * 3. Add them to your frontend .env file:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
 */

export const uploadImage = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        console.warn('⚠️ Cloudinary keys missing! Using mock image.');
        // Return a reliable placeholder from Unsplash
        return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop`;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(data.error?.message || 'Upload failed');
        }
    } catch (err) {
        console.error('❌ Cloudinary Upload Error:', err);
        throw err;
    }
};
