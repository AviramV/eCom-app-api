const passport = require('passport');
const localStrategy = require('passport-local');
const { getUser } = require('../services/userService');
const bcrypt = require('bcrypt');

module.exports = (app) => {

    app.use(passport.initialize(), passport.session());
    
    // Configure passport local strategy
    passport.use(
        new localStrategy(async function (username, password, done) {
            const failMessage = { message: 'Incorrect username or password.' }
            try {
                const user = await getUser(username);
                if (!user) return done(null, false, failMessage);
    
                const matchedPassword = await bcrypt.compare(password, user.password);
                if (!matchedPassword) return done(null, false, failMessage);
    
                return done(null, user);
            } catch (error) {
                return done(error);
            }
    
        })
    );
    
    passport.serializeUser((user, done) => {
        done(null, {
            id: user.id,
            username: user.user_name
        });
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}
