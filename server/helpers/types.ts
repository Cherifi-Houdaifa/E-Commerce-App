import { Request } from "express";

export interface AuthorizedRequest extends Request {
    user?: {
        id?: string;
        isAdmin?: boolean;
    };
}
