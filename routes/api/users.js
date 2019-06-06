const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const { transporter } = require('../../config/nodemailer')
const keys = require('../../config/keys')
const passport = require('passport')
const ConfirmEmail = require('../../templates/confirmEmail')

// Load User model
const User = require('../../models/User')

// Input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route   GET api/users/test
// @desc    Tests users
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users route works' }))

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists'
                return res.status(400).json(errors)
            }
            else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(12, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => {
                                console.log(user)
                                const confirmEmail = new ConfirmEmail(user._id, user.email)
                                const helperOptions = confirmEmail.setHelperOptions()
                                console.log(helperOptions)
                                transporter.sendMail(helperOptions, (error, info) => {
                                    // if (error) console.log(error)
                                })
                                res.json(user)
                            })
98                            .catch(() => console.log(err))
                    })
                })
            }
        })
})

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //Find User by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            //Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User Matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Create JWT Payload

                        //Sign Token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        });
                    }
                    else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// @route   PATCH api/users/confirm/:id
// @desc    Confirm user account / Set confirm property to true
// @access  Public
router.patch('/confirm/:id', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, { $set: { confirmed: 'false' } }, { new: true })
        .then(user => res.json(user))
        .catch(err => console.log(err))
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })
})

module.exports = router;
