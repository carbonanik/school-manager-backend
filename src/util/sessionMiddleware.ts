// import connectMemcached from "connect-memcached";
// import session from "express-session";

// const MemcachedStore = connectMemcached(session);
// export var sessionMiddleware = session({
//     store: new MemcachedStore({ hosts: [process.env.MEMCACHED_HOST || '127.0.0.1:11211'] }), // Connect to Memcached
//     secret: process.env.SESSION_SECRET || 'supersecretkey',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { 
//         secure: false, 
//         httpOnly: true, 
//         maxAge: 1000 * 60 * 60 * 24, 
//         sameSite: 'none',
//         // domain: '.at-tahfiz-international-madrasha.com'
//     },
//     // proxy: true,
// });

import connectMemcached from "connect-memcached";
import session from "express-session";

const MemcachedStore = connectMemcached(session);
export var sessionMiddleware = session({
    store: new MemcachedStore({ hosts: [process.env.MEMCACHED_HOST || '127.0.0.1:11211'] }), // Connect to Memcached
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
});