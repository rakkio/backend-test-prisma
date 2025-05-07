import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
    api_key: Bun.env.CLOUDINARY_API_KEY,
    api_secret: Bun.env.CLOUDINARY_API_SECRET
})


export default cloudinary