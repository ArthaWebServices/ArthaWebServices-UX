declare module "compression" {
  import { Request, Response, NextFunction, RequestHandler } from "express";

  namespace compression {
    interface CompressionOptions {
      chunkSize?: number;
      level?: number;
      memLevel?: number;
      strategy?: number;
      threshold?: number | string;
      windowBits?: number;
      filter?: (req: Request, res: Response) => boolean;
      brotli?: Record<string, unknown>;
    }

    function filter(req: Request, res: Response): boolean;
  }

  function compression(options?: compression.CompressionOptions): RequestHandler;

  export = compression;
}
