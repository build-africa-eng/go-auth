// src/utils/imgbb.js
export const uploadProfilePicture = async (file) => {
  try {
    console.log('Uploading to ImgBB:', { fileName: file.name });
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file (e.g., JPG, PNG).');
    }
    if (file.size > 32 * 1024 * 1024) {
      throw new Error('Image must be smaller than 32MB.');
    }

    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error.message || 'Failed to upload image.');
    }
    console.log('ImgBB Upload Success:', { url: result.data.url });
    return result.data.url;
  } catch (error) {
    console.error('ImgBB Upload Error:', { message: error.message });
    throw new Error(error.message);
  }
};