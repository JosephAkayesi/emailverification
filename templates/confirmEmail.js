const callToAction = require('./callToAction')

class ConfirmEmail {
    constructor(id, email, origin) {
        this.id = id
        this.email = email
        this.origin = origin
    }

    setHelperOptions = () => {
        return {
            from: `"Email Verification" <${process.env.SENDEREMAIL}>`,
            to: this.email,
            subject: 'Email Confirmation',
            text: `Please Click on the button below to confirm your account.`,
            html: callToAction(this.id, this.origin)
        }
    }
}

module.exports = ConfirmEmail
