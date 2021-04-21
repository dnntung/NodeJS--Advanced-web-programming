require('dotenv').config()
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const fs = require('fs')
const FileReader = require('./fileReader')
const multer = require('multer')
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

//Nhận và chuyển file upload vào thư mục sử dụng multer
const uploader = multer({
    dest: __dirname + '/uploads/'
})

//Viết trước UserRouter
app.use((req,res,next) => {
    req.vars = {root: __dirname /* __dirname là thư mục hiện tại chứa index.js */}
    next()
})

app.use('/user', UserRouter)


//Khởi tạo middleware để nạp đường dẫn thư mục cho từng user
const getCurrentDir = (req,res,next) => {
    if (!req.session.user) {
        return next()
    }
    const {userRoot} = req.session.user
    let {dir} = req.query //tham số dir trên thanh url cần nạp
    if (dir === undefined) {
        //Nếu không có dir trên url
        dir = ''
    }

    let currentDir = `${userRoot}${dir}`
    
    //Nếu sai đường dẫn hiện tại
    if (!fs.existsSync(currentDir)) {
        currentDir = userRoot
    }

    req.vars.currentDir = currentDir
    req.vars.userRoot = userRoot
    
    //Kết thúc middleware
    next()
}

//SỬ dụng middleware cho trang chủ
app.get('/', getCurrentDir, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login')
    }

    let {currentDir, userRoot} = req.vars
    let {dir} = req.query

    FileReader.load(userRoot, currentDir)
        .then(files => {
                const user = req.session.user
                return res.render('index', {user, files, dir})
            }
        )
})

app.post('/upload', uploader.single('attachment'), (req,res) => {

    const {email, path} = req.body
    file = req.file

    if (!email || !path || !file) {
        return res.json({
            code: 1,
            message: 'Thông tin không hợp lệ'
        })        
    }

    //Lấy đường dẫn user đang truy cập hiện tại
    const {root} = req.vars
    const currentPath = `${root}/users/${email}/${path}`


    if (!fs.existsSync(currentPath)) {
        return res.json({
            code: 2,
            message: 'Đường dẫn cần lưu không tồn tại'
        })
    }

    let name = file.originalname
    let newPath = currentPath + '/' + name

    fs.renameSync(file.path, newPath)

    return res.json({
        code: 0,
        message: 'Upload thành công'
    })
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))