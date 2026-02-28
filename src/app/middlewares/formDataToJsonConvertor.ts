import { NextFunction, Request, Response } from 'express';

export const formDataToJsonConvertor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body && typeof req.body.formData === 'string') {
    try {
      req.body = JSON.parse(req.body.formData);
    } catch (error) {
      // If parsing fails, you might want to handle it or just let it pass
      // For now, we'll let it pass to the next middleware or validator
    }
  }
  next();
};
