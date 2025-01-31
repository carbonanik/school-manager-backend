import { MemcachedStore } from "connect-memcached";
import { Request, Response, NextFunction } from "express";
import session from "express-session";

export var sessionMiddleware = session({
    store: new MemcachedStore({ hosts: [process.env.MEMCACHED_HOST || '127.0.0.1:11211'] }), // Connect to Memcached
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 hour
});