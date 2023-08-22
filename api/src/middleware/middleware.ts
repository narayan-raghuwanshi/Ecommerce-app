import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
export const secretKey = "alpha2002";
export const authenticateJwt:any = (req: Request, res: Response, next: NextFunction) => {    //revisit type: any
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!payload) {
                return res.sendStatus(403);
            }
            if (typeof payload === "string") {
                return res.sendStatus(403);
            }
            req.headers["username"] = payload.username;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};