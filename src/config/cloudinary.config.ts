import { v2 as cloudinary } from 'cloudinary';
import envConfig from './env.config';

cloudinary.config({
  cloud_name: envConfig.cloudinary.cloudinary_cloud_name,
  api_key: envConfig.cloudinary.cloudinary_api_key,
  api_secret: envConfig.cloudinary.cloudinary_api_secret,
});
export default cloudinary;
