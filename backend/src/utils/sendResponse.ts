import { Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ApiResponse } from "../types/apiResponse";

interface SendResponseParams<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

export const sendResponse = <T>({
  res,
  statusCode = HTTP_STATUS.OK,
  message,
  data
}: SendResponseParams<T>): Response<ApiResponse<T | null>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null
  });
};
