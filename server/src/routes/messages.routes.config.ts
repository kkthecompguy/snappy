import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CommonConfigRoutes } from "../common/common.routes.config";
import { messageService } from '../services';
import { baseurl } from '../utils/constants';
import { response } from '../utils/response';


export class MessageRoutes extends CommonConfigRoutes {
  constructor(app: express.Application) {
    super(app, "MessageRoutes")
  }

  async create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      from: req.body.from,
      to: req.body.to,
      message: req.body.message
    }

    const result = await messageService.create(data);
    if (result.success) {
      return response.success(res, { message: result.message })
    }
    return response.error(res, { statusCode: result.code, message: result.message })
  }

  async list(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      from: req.body.from,
      to: req.body.to
    }

    const result = await messageService.list(data);
    if (result.success) {
      return response.success(res, { data: result.data })
    }
    return response.error(res, { statusCode: result.code, message: result.message })
  }

  configureRoutes(): express.Application {
    this.app.route(`${baseurl}messages/create`).post(
      body('from', 'from is required').notEmpty().isString(),
      body('to', 'to is required').notEmpty().isString(),
      body('message', 'message is required').notEmpty().isString(),
      this.create
      );
    
      this.app.route(`${baseurl}messages/list`).post(
        body('from', 'from is required').notEmpty().isString(),
        body('to', 'to is required').notEmpty().isString(),
        this.list);

    return this.app;
  }
}