import { Response } from 'express';

interface SuccessResponse {
  success?: boolean;
  statusCode?: number;
  message?:string;
  count?: number;
  data?: any;
}


interface ErrorResponse {
  success?: boolean;
  message?: string;
  statusCode: number;
  code?: string
}


function success(res: Response, {success = true, message, statusCode = 200, count, data}: SuccessResponse) {
  res.status(statusCode).json({success, message, statusCode, count, data});
}

function error(res: Response, {success = false, message, statusCode}: ErrorResponse) {
  res.status(statusCode).json({success, message, statusCode})
}

export const response = {
  success,
  error
}