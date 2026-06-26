import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../types/error-codes.js";
import { AuthRepository } from "./auth.repository.js";
import { LoginUserInput, RegisterUserInput } from "./auth.schema.js";
import bcrypt from "bcrypt";
import { AuthResponse } from "./auth.types.js";
import { env } from "../../config/env.js";
import { generateAccessToken } from "../../utils/tokens.js";

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}
  private throwInvalidCredentials(): never {
    throw new AppError(
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid email or password",
    );
  }
  async register(data: RegisterUserInput): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError(
        409,
        ERROR_CODES.USER_ALREADY_EXISTS,
        "User with this email already exists",
      );
    }
    const passwordHash = await bcrypt.hash(data.password, env.SALT_ROUNDS);

    const newUser = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    const accessToken = generateAccessToken({
      sub: newUser.id,
      email: newUser.email,
    });

    return { user: newUser, accessToken };
  }
  async login(data: LoginUserInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(data.email);

    if (!user) {
      this.throwInvalidCredentials();
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.throwInvalidCredentials();
    }
    const { passwordHash, ...safeUser } = user;
    console.log("Safe User:", safeUser); // Log the safe user object for debugging

    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    return {
      user: safeUser,
      accessToken,
    };
  }
}
