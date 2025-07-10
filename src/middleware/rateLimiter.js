import ratelimit from "../config/upstash.js";

const rateLimiter = async(req,res,next) => {
    try {

        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            res.status(429).json({
                message: "Too many Request, Please Try Again Later",
            });
        }

        next();
        
    } catch (error) {
        console.log("Rate Limit Error", error);
        next(error)
    }
}

export default rateLimiter;
