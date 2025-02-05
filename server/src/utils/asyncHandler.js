const asyncHandler = (requestHandler) => {
return (req, res, next) => {    
Promise.resolve(requestHandler(req, res, next)).catch((next)=>next(err));
};
};
export default asyncHandler;