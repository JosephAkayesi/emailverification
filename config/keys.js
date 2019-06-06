// Use environment variables
require('dotenv').config()

if(process.env.NODE_ENV){
    module.exports = {
        mongoURI: process.env.MONGOURI,
        secretOrKey: process.env.SECRET,
        senderEmail: process.env.SENDEREMAIL,
        senderPassword: process.env.SENDERPASSWORD
    }
}
else {
    module.exports = {
        mongoURI: process.env.MONGOURI,
        secretOrKey: process.env.SECRET,
        senderEmail: process.env.SENDEREMAIL,
        senderPassword: process.env.SENDERPASSWORD
    }
}