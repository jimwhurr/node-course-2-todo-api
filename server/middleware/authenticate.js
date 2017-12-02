const {User} = require('./../models/user');


// this middleware function is going to modify the request object
// so that the routes can operate on the values
const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        if ( ! user ) {
            return Promise.reject();
        }
        // modify request object for the next route to pick up
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        // don't call next as the req has failed!
        res.status(401).send();
    });    
};

module.exports =  { authenticate };