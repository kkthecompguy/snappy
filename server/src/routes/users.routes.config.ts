import express, { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { CommonConfigRoutes } from "../common/common.routes.config";
import { userService } from '../services';
import { baseurl } from '../utils/constants';
import { response } from '../utils/response';

export class UsersRoute extends CommonConfigRoutes {
  constructor(app: express.Application) {
    super(app, "UsersRoute")
  }

  async setAvatar(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const data = {
      base64EncodedImage: req.body.image,
      userId: req.params.id
    };

    const result = await userService.setAvatar(data);
    if (result.success) {
      return response.success(res, { message: result.message })
    }
    return response.error(res, { statusCode: result.code, message: result.message })
  }

  async getUsers(req: Request, res: Response) {
    const result = await userService.getUsers(req.params.id);
    if (result.success) {
      return response.success(res, {data: result.data});
    }
    return response.error(res, {statusCode: result.code, message:result.message })
  }

  configureRoutes(): express.Application {
    this.app.route(`${baseurl}users/set/avatar/:id`).post(
      body('image', 'image is required').notEmpty().isString(),
      this.setAvatar
    );

    this.app.route(`${baseurl}users/list/:id`).get(this.getUsers);
    
    return this.app;
  }
}