const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json())
    .use(session(
        {
            secret: 'secret',
            resave: false,
            saveUninitialized: true,
        }
    ))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
        res.setHeader('Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS');
    next();
    })
    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']}))
    .use(cors({origin: '*'}))
    .use("/", require("./routes/index"))
    .use("/", require("./routes/swagger"))
    ;

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
    // This is the verify callback
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
    

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Running on port ${port}`);
        });
    }
});
