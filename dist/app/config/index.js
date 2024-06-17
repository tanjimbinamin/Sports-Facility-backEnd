"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT,
    databaseUri: process.env.DATABASE_URL,
    node_env: process.env.NODE_ENV,
    bcrypt_salt_round: process.env.BYCRYPT_SALT_ROUNDS,
    jwt_secret_key: process.env.JWT_ACCESS_SECRET,
    jwt_expires_key: process.env.JWT_ACCESS_EXPIRES_IN,
};
