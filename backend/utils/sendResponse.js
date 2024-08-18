const sendResponse = (res, status, message, success = false, data = null) => {
    return res.status(status).json({
        message,
        success,
        data
    });
};

export default sendResponse;
