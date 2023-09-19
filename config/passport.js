const DiscordStrategy = require('passport-discord').Strategy;

module.exports = (passport, db) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    passport.use(
        new DiscordStrategy(
            {
                // Discord OAuth configuration
            },
            (accessToken, refreshToken, profile, done) => {
                // Save user's profile data to the SQLite database (db)
            }
        )
    );
};
