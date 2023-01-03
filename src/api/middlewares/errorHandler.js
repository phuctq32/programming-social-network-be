const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({ error: {
        message,
        ...err
    } });
}

export default errorHandler;