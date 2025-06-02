const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/authenticate');

router.use('/users', isAuthenticated, require('./users'));
router.use('/items', require('./items'));

router.get(`/login`, passport.authenticate('github'), (req, res) => {
});

router.get(`/logout`, (req, res) => {
    req.logout(function(err){
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
