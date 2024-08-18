import jwt from 'jsonwebtoken';
import sendResponse from '../utils/sendResponse.js';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Corrected typo from 'cookiees' to 'cookies'
        if (!token) {
            return sendResponse(res, 401, 'You are not an authorized user');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // jwt.verify doesn't need to be awaited
        if (!decoded) {
            return sendResponse(res, 401, 'Invalid token');
        }

        req.id = decoded.userId;
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'An error occurred during authentication');
    }
};

export default isAuthenticated;
