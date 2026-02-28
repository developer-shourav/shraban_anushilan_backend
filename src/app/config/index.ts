import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASSWORD,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  nodemailer_user: process.env.NODE_MAILER_USER,
  nodemailer_pass: process.env.NODE_MAILER_PASS,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  super_admin_name_fst: process.env.SUPER_ADMIN_FST_NAME,
  super_admin_name_lst: process.env.SUPER_ADMIN_LST_NAME,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  r2_account_id: process.env.R2_ACCOUNT_ID,
  r2_access_key_id: process.env.R2_ACCESS_KEY_ID,
  r2_secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
  r2_bucket_name: process.env.R2_BUCKET_NAME,
  r2_public_url: process.env.R2_PUBLIC_URL,
};
