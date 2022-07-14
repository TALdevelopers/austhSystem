// -------local auth------

const LocalStrategy = require('passport-local').Strategy;

const passport = require('passport');
const { use } = require('passport');
const { User } = require('./database');

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


exports.initializingPassport = (passport) =>{

    const GOOGLE_CLIENT_ID = '94342231851-qs8hjklcn503m17i5j3pe5upuu9eekfo.apps.googleusercontent.com';
    const GOOGLE_CLIENT_SECRET = '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';

    passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
        }
    ));

    passport.use(new LocalStrategy(async (username, password, done)=>{
        try {
            const user = await User.findOne({ username });
        if (!user) return done(null, false);
        if(user.password !== password) return done(null, false);
        return done(null, user);
        } catch (error) {
            return done(error, false);
        }

    }))

    passport.serializeUser((user, done)=>{
        done(null, user);
    });
    
    passport.deserializeUser((user, done)=>{
        done(null, user);
    });
    
    // passport.serializeUser((user, done)=>{
    //     done(null, user.id);
    // });


    // passport.deserializeUser(async(id, done) => {
    //     try {
    //         const user = await User.findById(id);
    //         done(null, user);
    //     } catch (error) {
    //         done(error, false);
    //     }
    // });
};


exports.isAuthenticated = (req, res, next)=> {
if(req.user) return next();
res.redirect("/login");
}

//-------google auth------

// const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// const GOOGLE_CLIENT_ID = '94342231851-qs8hjklcn503m17i5j3pe5upuu9eekfo.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = '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';

// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     return done(err, profile);
//     }
// ));
