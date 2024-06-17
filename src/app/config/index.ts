import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  databaseUri: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_round: process.env.BYCRYPT_SALT_ROUNDS,
  jwt_secret_key: process.env.JWT_ACCESS_SECRET,
  jwt_expires_key: process.env.JWT_ACCESS_EXPIRES_IN,
};
