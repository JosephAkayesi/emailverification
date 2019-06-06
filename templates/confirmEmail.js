class ConfirmEmail {
    constructor(id, email) {
        this.id = id
        this.email = email
        console.log('confirm email constructor run')
    }

    setHelperOptions = () => {
        console.log('confirm email run')
        return {
            from: '"Happy Hour" <happyhourcodelnapp@gmail.com>',
            to: this.email,
            subject: 'Account check',
            text: `Please Click on the button below to confirm your account.`,
            html: `<button type="button" class="btn btn-primary"><a href='http://localhost:5000/api/users/confirm/${this.id}>click to confirm email</a></button>`
        }
    }
}


module.exports = ConfirmEmail
