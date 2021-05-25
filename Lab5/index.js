var express = require('express')
var app = express()
var https = require('https')
var fetch = require('node-fetch')
var myBodyParser = require("./myBodyParser.js")
var cookieParser = require("cookie-parser")
var session = require("express-session")
var flash = require("express-flash")
const {check, validationResult} = require("express-validator")

app.use(express.json());
//app.use(express.urlencoded({extended: false}))
app.use(myBodyParser)
app.use(cookieParser("lab5"))
app.use(session({
     cookie: {maxAge: 60000},
}))
app.use(flash())

let validator = [
     check("name").exists().withMessage("Vui lòng nhập tên")
     .notEmpty().withMessage("Tên không được để trống")
     .isLength({min: 3}).withMessage("Tên phải có tối thiểu 3 kí tự")
     .isLength({max: 15}).withMessage("Tên phải có tối đa 15 kí tự"),

     check("gender").exists().withMessage("Vui lòng chọn giới tính"),

     check("email").notEmpty().withMessage("Email không được để trống")
     .isEmail().withMessage("Đây không phải là email hợp lệ")
]

app.set('view engine', "ejs")

app.get('/',(req,res) => { 
     const request = https.request({
          hostname: 'web-nang-cao.herokuapp.com', 
          path: '/lab5/users',
          port: 443, //default port for https (http: 80)
          method: 'get'
     }, r => { 
          let body = ''
          
          r.on('data', d=> body+=d.toString())
          r.on('end', ()=>{ 
               let users = JSON.parse(body)
               res.render('index', {users})
          })
          r.on('error',e=>console.log(e))
     })
     
     request.on('error', e=>console.log(e))
     request.end()
})

app.get('/add', (req,res) => { 
     let error = req.flash("error")
     res.render('add', {error})
})

app.post('/add', validator, (req,res) => { 
     let result = validationResult(req)
     console.log(result)

     let {name, age, gender, email} = req.body     

     if (result.errors.length > 0){ 
          req.flash("error", result.errors[0].msg)
          res.redirect('/add')
     }
     else{ 
          res.end("OK")
     }
})

app.post('/delete/:id', (req,res) => { 
     if (!req.params.id){ 
          return res.json({
               code:1,
               message: "Invalid ID!"
          })
     }

     let id = req.params.id

     fetch('https://web-nang-cao.herokuapp.com/lab5/users/'+id, { 
          method: "delete"
     })
     .then(res => res.json())
     .then(json => {
          if (json.code === 0){ 
               return res.json(json)
          }
     })
     .catch(e =>{
          return res.json({
               code: 2, 
               message: e
          })
     })
})

app.post('/update', (req,res) => { 
     let {id, name, gender, age, email} = req.body

     if (!(id && name && gender && age && email)){ 
          return res.json({
               code:1,
               message: "Invalid information!"
          })
     }
     let user = { 
          id: id,
          name: name,
          age: parseInt(age),
          gender: gender,
          email: email
     }
     console.log(user)

     fetch("https://web-nang-cao.herokuapp.com/lab5/users", { 
          method: "PUT", 
          headers: { 
               "Content-Type":"application/json"
          },
          body:  JSON.stringify(user)
     })
     .then(res => res.json())
     .then(json => { 
          console.log(json)
          return res.json(json)
     })
     .catch(e => console.log(e))
})

var port = process.env.port || 8080 
app.listen(port)