require('dotenv').config()
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')

const UserRouter = require('./routers/UserRouter')

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false})) // express cũng có urlencoded, không cần cài thêm body-parser
app.use(session({
    secret: 'mvm',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash());

app.use('/user', UserRouter)

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login')
    }
    const user = req.session.user
    res.render('index', {user})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))