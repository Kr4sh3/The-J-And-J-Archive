'use strict';

import auth from 'basic-auth';
import bcrypt from 'bcryptjs';
import { User } from './models/index.js';

// Middleware to authenticate the request using Basic Authentication.

const authenticateUser = async (req, res, next) => {
    // If the user's credentials are available...
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).

    // If a user was successfully retrieved from the data store...
    // Use the bcrypt npm package to compare the user's password
    // (from the Authorization header) to the user's password
    // that was retrieved from the data store.

    // If the passwords match...
    // Store the retrieved user object on the request object
    // so any middleware functions that follow this middleware function
    // will have access to the user's information.

    // If user authentication failed...
    // Return a response with a 401 Unauthorized HTTP status code.

    // Or if user authentication succeeded...
    // Call the next() method.
    const credentials = auth(req);

    if (!credentials) {
        console.warn('Auth header not found');
        return res.status(401).json({ message: 'Access Denied' });
    }

    const user = await User.findOne({ where: { email: credentials.name } });

    if (!user) {
        console.warn(`User not found for username: ${credentials.name}`);
        return res.status(401).json({ message: 'Access Denied' });
    }

    const authenticated = bcrypt.compareSync(credentials.pass, user.confirmedPassword);

    if (!authenticated) {
        console.warn(`Authentication failed for username: ${credentials.name}`);
        return res.status(401).json({ message: 'Access Denied' });
    }

    console.log(`Authentication successful for username: ${user.name}`);
    req.currentUser = user;
    next();
}
export default authenticateUser;