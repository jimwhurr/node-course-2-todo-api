const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


/////////////////// I N S T A N C E   M E T H O D S ///////////////////

// override toJSON method, selecting only public parts of the schema
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

// create a new method
UserSchema.methods.generateAuthToken = function () {    // done because we need 'this'
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    //                     {      data to be signes            },  secret

    // now update tokens[]
    user.tokens.push({access, token});

    // now save, return the token as a promise
    return user.save().then( () => {
        return token;
    });
};

////////////////////// M O D E L   M E T H O D S //////////////////////

UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;

    try {   //jwt.verify() may throw exceptions
        decoded = jwt.verify(token, 'abc123');        
    }
    catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        //});
        return Promise.reject();
    }

    return User.findOne({       // returning a promise to the caller     
        '_id': decoded._id,
        'tokens.token': token,  // note: quaotes required when firled name has a .
        'tokens.access': 'auth'
    });
};

///////////////////////////////////////////////////////////////////////

const User = mongoose.model('User', UserSchema);

module.exports = { User };