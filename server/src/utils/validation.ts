import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';

/**
 * Validate request data and return validated data
 */
export const validateRequest = (req: Request, schema: Joi.ObjectSchema): any => {
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const errorMessage = error.details.map(d => d.message).join(', ');
    throw new ValidationError(errorMessage);
  }
  
  return value;
};

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: string[] = [];

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  pagination: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
  }),
  search: Joi.object({
    q: Joi.string().min(2).max(100).required(),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
  includeGeometry: Joi.object({
    includeGeometry: Joi.boolean().default(false),
  }),
};
