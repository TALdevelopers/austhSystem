const express = require("express");
const { connectMongoose, User } = require("./database");
const app = express();
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig");
const expressSession = require("express-session");
const logger = require("./logger");



connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(expressSession({
    secret: "secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/profile", isAuthenticated, (req, res) => {
    res.send("Secret page!!!!");
    if(req.user.username){
        logger.info(`${req.user.username} has logged in`);}
        else{
            logger.info(`${req.user.displayName} has logged in by Google`);
        }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

// app.get("/logout", (req, res) => {
//     req.logout();
//     res.send("Logged out!!");
// });

app.get('/logout', function (req, res){
    if(req.user.username){
    logger.error(`${req.user.username} has logged out`);}
    else{
        logger.error(`${req.user.displayName} has logged out`);
    }
    req.session.destroy(function (err) {
    res.send("logged out!!"); //Inside a callback… bulletproof!
});
});


app.get("/auth/google",
passport.authenticate('google', { scope: ['email', 'profile']}));

app.get("/google/callback",
passport.authenticate('google', { successRedirect:"/protected", failureRedirect:"/auth/failure" }));

app.get("/auth/failure", (req,res)=>{
    res.send("failed with google auth!")
});


app.get('/protected', isAuthenticated, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
  });


app.post("/register", async (req, res) => {
    const user = await User.findOne({username: req.body.username });
    if (user) return res.status(400).send("User already exists");
    const newUser = await User.create(req.body);
    res.redirect("/login");
});

app.post("/login", passport.authenticate("local", 
{failureRedirect:"/login",
 successRedirect:"/profile"
}));


app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});