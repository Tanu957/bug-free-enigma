
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const dbLink = 'mongodb://0.0.0.0:27017/OnlineBookStore';

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.s_m = req.flash('success');
    res.locals.e_m = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.redirect('/books');
});

app.use('/books', require('./routes/books'));
app.use('/users', require('./routes/users'));
app.use('/books/:id/comments', require('./routes/comments'));
app.use('/admin', require('./routes/admin'));

const port = 1000;
mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server Started at port ${port}`);
        console.log('MongoDB Connected');
    })
}).catch((err) => {
    console.log('Could not connect', err);
});