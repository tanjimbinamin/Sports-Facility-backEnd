"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const createUserIntoDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(userData);
    return result;
});
const userLogin = (info) => __awaiter(void 0, void 0, void 0, function* () {
    //check if user exist
    const user = yield user_model_1.User.findOne({ email: info.email }).select(['-__v']);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found! Please Check your email.');
    }
    //check password is matched with database password 
    const isPasswordMatch = yield bcrypt_1.default.compare(info.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password did not matched! Please check again.');
    }
    //creating user data to include in token
    const userjwt = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    // create token
    const accessToken = (0, auth_utils_1.createToken)(userjwt, config_1.default.jwt_secret_key, config_1.default.jwt_expires_key);
    return {
        accessToken: `Bearer ${accessToken}`,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
        },
    };
});
exports.AuthService = {
    createUserIntoDB,
    userLogin,
};
