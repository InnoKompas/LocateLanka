import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export interface DemoTokenPayload {
  type: 'demo';
  sessionId: string;
  maxRequests: number;
  requestsUsed: number;
  expiresAt: number;
  createdAt: number;
  origin?: string | undefined;
}

export interface DemoTokenData {
  token: string;
  sessionId: string;
  maxRequests: number;
  expiresAt: number;
}

class DemoTokenService {
  private readonly secret: string;
  private readonly tokenExpiry: number = 60 * 60 * 1000; // 1 hour
  private readonly maxRequests: number = 50; // 50 requests per token
  private activeSessions = new Map<string, DemoTokenPayload>();

  constructor() {
    this.secret = process.env['DEMO_JWT_SECRET'] || 'demo-secret-key-change-in-production';
    if (process.env['NODE_ENV'] === 'production' && this.secret === 'demo-secret-key-change-in-production') {
      throw new Error('DEMO_JWT_SECRET must be set in production');
    }

    // Cleanup expired sessions every 5 minutes
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }

  /**
   * Generate a new demo token
   */
  generateDemoToken(origin?: string): DemoTokenData {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    const expiresAt = now + this.tokenExpiry;

    const payload: DemoTokenPayload = {
      type: 'demo',
      sessionId,
      maxRequests: this.maxRequests,
      requestsUsed: 0,
      expiresAt,
      createdAt: now,
      origin
    };

    // Store session
    this.activeSessions.set(sessionId, payload);

    // Generate JWT token
    const token = jwt.sign(payload, this.secret, {
      expiresIn: '1h',
      issuer: 'lankalocate-demo',
      subject: sessionId
    });

    return {
      token,
      sessionId,
      maxRequests: this.maxRequests,
      expiresAt
    };
  }

  /**
   * Validate and consume a demo token
   */
  validateAndConsumeToken(token: string): DemoTokenPayload {
    try {
      // Verify JWT
      const decoded = jwt.verify(token, this.secret) as DemoTokenPayload;
      
      if (decoded.type !== 'demo') {
        throw new AppError('Invalid token type', 401);
      }

      // Check if session exists
      const session = this.activeSessions.get(decoded.sessionId);
      if (!session) {
        throw new AppError('Demo session expired or invalid', 401);
      }

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.activeSessions.delete(decoded.sessionId);
        throw new AppError('Demo token expired', 401);
      }

      // Check request limit
      if (session.requestsUsed >= session.maxRequests) {
        throw new AppError('Demo request limit exceeded. Please sign up for an API key.', 429);
      }

      // Increment usage
      session.requestsUsed += 1;
      this.activeSessions.set(decoded.sessionId, session);

      return session;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid demo token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Demo token expired', 401);
      }
      throw error;
    }
  }

  /**
   * Get session info
   */
  getSessionInfo(sessionId: string): DemoTokenPayload | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Revoke a demo session
   */
  revokeSession(sessionId: string): boolean {
    return this.activeSessions.delete(sessionId);
  }

  /**
   * Get demo statistics
   */
  getStats() {
    const now = Date.now();
    const sessions = Array.from(this.activeSessions.values());
    
    return {
      activeSessions: sessions.length,
      totalRequests: sessions.reduce((sum, session) => sum + session.requestsUsed, 0),
      expiredSessions: sessions.filter(session => now > session.expiresAt).length
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now > session.expiresAt) {
        this.activeSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[DemoTokenService] Cleaned up ${cleanedCount} expired demo sessions`);
    }
  }
}

// Export singleton instance
export const demoTokenService = new DemoTokenService();
export default demoTokenService;
