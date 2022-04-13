import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CommonConfigRoutes } from '../common/common.routes.config';
import { authService } from '../services';
import { response } from '../utils/response';

export class AuthRoutes extends CommonConfigRoutes {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = {
      emailOrUsername: req.body.emailOrUsername,
      password: req.body.password
    }
    const result = await authService.login(data);
    if (result.success) {
      return response.success(res, { message: result.message, data: result.data })
    }
    return response.error(res, { message: result.message, statusCode: result.code });
  }

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
    const result = await authService.register(data);
    if (result.success) {
      return response.success(res, { message: result.message })
    }
    return response.error(res, { statusCode: result.code, message: result.message })
  }

  configureRoutes(): express.Application {

    this.app.route('/api/v1/auth/register').post(
      body('username', 'username is required').notEmpty().isString(),
      body('email', 'please include valid email').notEmpty().isEmail().normalizeEmail(),
      body('password', 'password should be at least 8 characters').notEmpty().isString(),
      this.register);

    this.app.route('/api/v1/auth/login').post(
      body('emailOrUsername', 'email or username is required').notEmpty().isString(),
      body('password', 'password is required').notEmpty().isString(),
      this.login);

    return this.app;
  }
}