"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const connect_memcached_1 = require("connect-memcached");
const express_session_1 = __importDefault(require("express-session"));
exports.sessionMiddleware = (0, express_session_1.default)({
    store: new connect_memcached_1.MemcachedStore({ hosts: [process.env.MEMCACHED_HOST || '127.0.0.1:11211'] }), // Connect to Memcached
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 hour
});
