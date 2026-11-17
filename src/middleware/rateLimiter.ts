import { Request, Response, NextFunction } from "express";

const requestMap = new Map<string, { count: number; expiresAt: number }>();

// Periodic prune to prevent memory leaks
function pruneExpiredEntries() {
  const now = Date.now();
  for (const [key, val] of requestMap.entries()) {
    if (now > val.expiresAt) {
      requestMap.delete(key);
    }
  }
}

export function rateLimiter(limit = 10, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Periodically prune when map gets large
    if (requestMap.size > 500) {
      pruneExpiredEntries();
    }

    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const entry = requestMap.get(ip);

    if (!entry || now > entry.expiresAt) {
      requestMap.set(ip, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment before trying again.",
      });
    }

    entry.count += 1;
    next();
  };
}

