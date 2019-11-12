const jwt = require("jsonwebtoken");
let blTokens = [];
module.exports = {
    verifyJWT: async (req, res, next) => {
        if (!req.header('Authorization')){
            res.status(401).send({error: 'Invalid JWT sent!'}).end();
            return;
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        if(blTokens.indexOf(token) >= 0){
            res.status(401).send({error: 'Invalid JWT sent!'}).end();
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
            if (err) {
                res.status(401).send({error: 'Invalid JWT sent!'}).end();
            } else {
                req.user_id = data.id;
                console.log("IS ADMIN GIVEN AS " + data.is_admin);
                req.is_admin = data.is_admin;
                req.token = token;
                next()
            }
        });
    },
    blacklistToken: (token)=>{
        console.log("blacklisted " + token);
        blTokens.push(token);
    }
};