const errorHandler = (error, req, res, next) => {
    const { statusCode, message } = error;
    res.status(statusCode || 500).json({ message, error });
}

export default errorHandler;