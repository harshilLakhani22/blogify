import { sign, verify } from "jsonwebtoken";

const secret = "H@rrY#2264";

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    };
    const token = sign(payload, secret);

    return token;
}

function validateToken(token){
    const payload = verify(token, secret);

    return payload;
}

export default {
    createTokenForUser,
    validateToken,
}