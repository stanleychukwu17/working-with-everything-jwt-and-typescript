import { Request, Response } from "express";
import { createSession, getUser, invalidateSession } from "../db/";
import { signJWT, verifyJWT } from "../utils/jwt.utils";

// login handler
export function createSessionHandler(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = getUser(email);

    if (!user || user.password !== password) {
        return res.status(401).send("Invalid email or password");
    }

    const session = createSession(email, user.name);
    const {sessionId} = session

    // create access token
    const accessToken = signJWT(
        {email: user.email, name: user.name, sessionId: sessionId},
        "24h"
    );

    const refreshToken = signJWT({sessionId: sessionId}, "1y");

    // set access token in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 3000000, // 50 minutes
        httpOnly: true, // using httpOnly cookie is recommended instead of using local storage
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
    });

    // send user back, but the teacher did line
    return res.send(session);
}

// get the session session

// log out handler
export function getSessionHandler(req: Request, res: Response) {
    // @ts-ignore
    return res.send(req.user);
}

export function deleteSessionHandler(req: Request, res: Response) {
    res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
    });

    // @ts-ignore
    const session = invalidateSession(req.user.sessionId);

    return res.send(session);
}