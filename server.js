require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    app.emit('ok')
}).catch(e => console.log(e))

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

const path = require('path'); //NÂO SEI
const routes = require('./routes')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { middleGlobal } = require('./src/middlewares/middleware')


const sessionOptions = session({
    secret: 'akasdfj0út23',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    }
  });
  
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/modules', express.static(path.join(__dirname, 'frontend', 'modules'))); // Pasta modules
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(sessionOptions);
app.use(flash());
app.use(middleGlobal)
app.use(routes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        error: {}
    });
});

app.on('ok', () => {
    app.listen(port, () => {
        console.log('servidor rodando acesse http://localhost:3000')
    })
})