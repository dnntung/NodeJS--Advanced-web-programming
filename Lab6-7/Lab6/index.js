require('dotenv').config()
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const UserRouter = require('./routers/User')

const app = express()

app.set('view engine', 'ejs')
app.use(flash())

//Sử dụng body-parser để xử lí req body
app.use(bodyParser.urlencoded({extended: false}))

//Lưu cookie và session vào client cũng như set các điều kiện bảo mật cho cookie
app.use(cookieParser('mvm'))
app.use(session({
     cookie: {maxAge: 60000}
}))

app.use('/user', UserRouter)

app.get('/', (req,res) => {
     //Kiểm tra có session đăng nhập hay chưa
     if (!req.session.user) {
          return res.redirect('/user/login')
     }
     const user = req.session.user
     res.render('index', {user})
})


const port = process.env.PORT || 8080
app.listen(port, () => console.log('http://localhost:'+port))