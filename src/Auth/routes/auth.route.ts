import { Router } from "express";
import AuthCenterController from "../controllers/auth.controller";
import { rateLimiter } from "@SRC/Helper/Middlewares/rate-limit";

/**
 * @function authRoutes
 * @description
 * Registers authentication-related routes to the provided Express Router instance,
 * with per-route rate limiting to mitigate abuse and brute-force attacks.
 *
 * @param {Router} app - An instance of Express Router to attach the auth routes to.
 * @returns {Router} - The modified router with authentication routes registered.
 *
 * @route POST /auth/sign-up - Registers a new user (limited to 5 requests per minute).
 * @route POST /auth/sign-in - Logs in a user (limited to 10 requests per minute).
 * @route POST /auth/sign-out - Logs out a user (limited to 30 requests per minute).
 * @route POST /auth/refresh-token - Refreshes access token (limited to 20 requests per minute).
 */

const authRoutes = (app: Router): Router => {
    app.post('/auth/sign-up', rateLimiter(5, 60 * 1000), AuthCenterController);
    app.post('/auth/sign-in', rateLimiter(10, 60 * 1000), AuthCenterController);
    app.post('/auth/sign-out', rateLimiter(30, 60 * 1000), AuthCenterController);
    app.post('/auth/refresh-token', rateLimiter(20, 60 * 1000), AuthCenterController);

    return app;
}

export default authRoutes;