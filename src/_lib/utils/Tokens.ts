import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenHandler {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || "ysdfsfasfsdafkl;ads3243022342034";
    this.refreshTokenSecret =
      process.env.REFRESH_TOKEN_SECRET || "2434234rjfsdafsafdfj;aff";
    this.accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1h";
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";
  }

  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  public generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  public verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  public verifyRefreshToken(token: string): string | null {
    try {
      const decoded = jwt.verify(
        token,
        this.refreshTokenSecret
      ) as TokenPayload;
      return decoded.userId || null;
    } catch (error) {
      return null;
    }
  }
}
