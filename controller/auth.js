var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var User = require("../model/user")
var bcrypt = require('bcryptjs')
require('dotenv').config()

const JWT_SECRET_KEY = process.env.JWT

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const mailgun = require("mailgun-js");
const DOMAIN = process.env.Domain;
const mg = mailgun({
    apiKey: process.env.API_KEY,
    domain: DOMAIN,
    host: 'api.eu.mailgun.net'
});

var sess
module.exports.login = async (req, res, next) => {
    try {
        const {
            username,
            password
        } = req.body
        const user = await User.findOne({
            username
        }).exec()
        if (!user) {
            res.json({
                status: "error",
                message: "User does not exist"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({
                msg: "Incorrect Username or Password",
                status: false
            });
        const token = jwt.sign({
                id: user._id,
                username: user.username
            },
            JWT_SECRET_KEY
        )

        sess = req.session
        sess.token = token
        sess.user = username
        return res.json({
            status: true,
            token,
            msg: "Login Successfully"
        });
    } catch (error) {
        console.log(error)
        return res.json({
            status: false,
            msg: "An error occurred"
        });
    }
};

module.exports.register = async (req, res, next) => {
    const {
        username,
        email,
        password: plainTextPassword
    } = req.body

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await User.create({
            username,
            email,
            password
        })
        res.json({
            status: "ok",
            message: "Account created successfully"
        })
    } catch (error) {
        if (error.code === 11000) {
            res.json({
                status: "error",
                message: "Account exists"
            })
        } else {
            res.json({
                status: "error",
                message: "An error occurred... Try again later"
            })
        }
    }
};

module.exports.accountRecovery = async (req, res, next) => {
    const email = req.body.email
    const user = await User.findOne({
        email
    }).lean()

    const token = user.password

    if (!user) {
        res.json({
            status: "error",
            message: "Account does not exist"
        })
    } else {
        const data = {
            from: `recover@${process.env.Domain}`,
            to: email,
            subject: 'Recover Account',
            html: `<p>Click on the button below to recover your account</p><br><a href='https://to-do-list-bakare.onrender.com/RecoverAccount/${token}'><button>Recover</button></a>`
        };
        mg.messages().send(data, async function (error, body) {
            if (error) {
                return res.json({
                    status: "error"
                })
            } else {
                res.json({
                    status: "ok",
                    message: "An email has been sent to you"
                })
            }
        });
    }
};

module.exports.recoveryPasswordChange = async (req, res) => {
    const newpassword = req.body.password

    let sess = req.session

    token = sess.token
    const user = jwt.verify(token, process.env.JWT)
    const _id = user.id

    const password = await bcrypt.hash(newpassword, 10)

    await memberauth.updateOne({
        _id
    }, {
        $set: {
            password: password
        }
    })
    res.json({
        message: "Account recovered successfully"
    })
}

module.exports.changePassword = async (req, res, next) => {
    let sess = req.session
    if (sess.token) {
        try {
            const {
                newpassword
            } = req.body


            const token = sess.token

            const user = jwt.verify(token, process.env.JWT)
            const _id = user.id

            const userAuth = await User.findOne({
                username: user.username
            })

            const password = await bcrypt.hash(newpassword, 10)

            await userAuth.updateOne({
                _id
            }, {
                $set: {
                    password: password
                }
            })
            return res.json({
                status: true,
                msg: "Password change Successfully"
            });
        } catch (error) {
            console.log(error)
            return res.json({
                status: false,
                msg: "An error occurred"
            });
        }
    } else {
        return res.json({
            status: false,
            msg: "User not available"
        });
    }
};

module.exports.logOut = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.json({
                status: "error",
                message: "An error occurred"
            })
        } else {
            res.json({
                status: "ok",
                message: "Logout successfully"
            })
        }
    })
};