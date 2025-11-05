import jwt from "jsonwebtoken";

export const generateToken = (user) => {


    try {
        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN || "1d" });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Failed to generate token");
    }
};