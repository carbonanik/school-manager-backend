import { Request, Response, NextFunction } from "express";
import { HTTPError } from "./errors";

export var errorHandleMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err instanceof HTTPError) {
      res.status(err.status).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: 'Something went wrong!' });
  }