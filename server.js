const express = require("express");
const bodyparser = require("body-parser");
const session = require("express-session");
const cors = require("cors")
const cookieParser = require("cookie-parser");
require("dotenv").config()

const user = require('./routes/auth');
const tasks = require('./routes/task')

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}))

app.use(cors());
app.use(express.json());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "dhfkshshakakdhakdhdhsk",
    saveUninitialized: true,
    cookie: {
        maxAge: oneDay
    },
    resave: false
}));
app.use(cookieParser());

app.use('/api/user', user);
app.use('/api/user/task', tasks);

app.listen(port, () => {
    console.log(`Listening to the server ${port}...`)
});