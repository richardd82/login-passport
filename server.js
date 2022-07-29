const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;
const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: true }));
app.use(cookieParser('secreto'));
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function(username, password, done){    
    if(username === 'richardd82' && password === '123456'){
        return done(null, {id:1, name: 'Richard'});
    }
    done(null, false);
}));
//serialización
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    done(null, {id: 1, name: 'Richard'})
});

app.set('view engine', 'ejs');

app.get("/login", (req, res) => {
    //Aquí mostramos el formulario de login
    res.render("login");
})
app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}));
app.get("/", (req, res, next) => {
    if(req.isAuthenticated()) return next();

    res.redirect("/login");
}, (req,res) => {
    //Se muestra esta ruta si ya se inició session
    res.send('Logeado correctamente');
    //Si no se valida la sesión se redirecciona a /login
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });