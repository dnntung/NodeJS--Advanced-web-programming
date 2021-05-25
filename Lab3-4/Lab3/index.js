const express = require('express')
const bodyParser = require('body-parser')
const emailValidator = require('email-validator')
const multer =  require('multer')
const app = express()

const upload = multer({des: 'uploads', fileFilter: (req, file, callback) => { 
    if(file.mimetype.startsWith('image/')){ 
        callback(null,true)
    }
    else{ 
        callback(null,false)
    }
}, limits: {fileSize: 500000}}) //5kb max

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => { 
    res.render("index")
})

app.get('/add', (req, res) => { 
    res.render('add')
})

app.post('/add', (req, res) => { 
    let uploader = upload.single('image')
    uploader(req,res,err => { 
        let product = req.body
        let image = req.file
        if(err){ 
            res.end("Image too large")
        }
        else if(!image){ 
            res.end("No or invalid file")
        }
        else{ 
            res.end("Xu li POST them san pham")
    }    
    })
})

app.get('/login', (req,res) => { 
    res.render('login', {email: '', password: ''})
})

app.post('/login', (req,res) => { 
    //console.log(req.body)

    let acc = req.body

    if(!acc.email){ 
        error = 'Vui long nhap email'
    }
    else if(!emailValidator.validate(acc.email)){ 
        error = 'Email khong dung dinh dang'
    }
    else if(!acc.password){ 
        error = 'Vui long nhap mat khau'
    }
    else if(acc.password.lenght < 6){ 
        error = 'mat khau phai co tu 6 ki tu'
    }
    else if (acc.email !== 'admin@gmail.com' || acc.password != '123456'){
        error = "Sai email hoac mat khau"
    }

    if(error.length > 0){ 
        res.render('login', {errorMessage: error, email: acc.email, password: acc.password})
    }
    else{ 
        res.set("Content-Type", "text/html")
        res.end("Dang nhap thanh cong")
    }

    res.end('xu li dang nhap qua post')
})

app.use((req,res) => { 
    res.set('Content-Type', "text/html")
    res.render('error', {title: "404", message: "Trang khong ton tai"})
})

app.listen(8080, () => console.log("http://localhost:8080"))