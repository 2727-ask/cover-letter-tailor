import { Request, Response } from "express";

// Health check controller
export const healthController = (req: Request, res: Response) => {
    console.log("Health Check Request");

    res.status(200).json({
        status: "success",
        message: "Server is healthy",
        uptime: process.uptime(),
    });
};