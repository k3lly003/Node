import jwt from 'jsonwebtoken';


const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify (token.replace('Bearer ', ''), process.env.JWT_SECRET); 
        req.user = decoded;

        console.log(decoded);
        

        if (!req.user.name) {
            return res.status(400).json({ msg: 'Invalid token payload: missing name' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;

