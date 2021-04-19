const express = require('express')
const {check, validationResult} = require('express-validator')
const db = require('../db')
const bcrypt = require('bcrypt')

const Router = express.Router()

const loginValidator = [
     check('username').exists().withMessage('Vui lòng nhập tên người dùng')
          .notEmpty().withMessage('Không được để trống tên người dùng'),

     check('password').exists().withMessage('Vui lòng nhập password')
          .notEmpty().withMessage('Không được để trống password'),
]

Router.get('/login', (req,res) => {
     //Kiểm tra và bắt người dùng vào trang chủ nếu có session
     if (req.session.user) {
          return res.redirect('/')
     }
     //Nhận error message từ flash
     const error = req.flash('error') || ''

     res.render('login', {error})
})

Router.post('/login', loginValidator, (req,res) => {
     //Nhận kết quả kiểm tra từ validator
     let  result = validationResult(req)

     if (result.errors.length === 0) {
          const {username, password} = req.body

          //Hash và lấy kết quả hash
          const hashedPassword = bcrypt.hashSync(password, 10)

          //Thêm dữ liệu từ client vào db
          const sqlQuery = `select * from account where email=?`
          const params = [username]
          db.query(sqlQuery, params, (err, result, fields) => {
               if (err) { 
                    //Trả về error bằng flash cho /register để hiển thị
                    req.flash('error', err.message)
                    return res.redirect('/user/login')
               }
               else if (result.length ===0 ) {
                    req.flash('error', 'Email không tồn tại')
                    return res.redirect('/user/login')
               }
               else {
                    let hashedPassword = results[0].password
                    let match = bcrypt.compareSync(password, hashedPassword)
                    if (!match) {
                         req.flash('error', 'Thông tin đăng nhập không chính xác')
                         return res.redirect('/user/login')
                    }
                    //Lưu thông tin đăng nhập thành công vào session và chuyển hướng đến trang chủ
                    req.session.user = results[0]
                    return res.redirect('/')
               }
               
          })

          return
     } 

     let message
     result = result.mRoutered()
     for (fields in result) {
          message = result[fields].msg
          break
     }

     //Gửi flash error cho server trước khi điều hướng
     req.flash('error', message)
     res.redirect('/user/login')
})

//Tạo validator để kiểm tra các thông tin gửi lên server
const registerValidator = [
     check('name').exists().withMessage('Vui lòng nhập tên người dùng')
          .notEmpty().withMessage('Không được để trống tên người dùng')
          .isLength({min: 6}).withMessage('Tên người dùng phải từ 6 kí tự'),

     check('email').exists().withMessage('Vui lòng nhập email')
          .notEmpty().withMessage('Không được để trống email người dùng')
          .isEmail().withMessage('Email không hợp lệ'),

     check('password').exists().withMessage('Vui lòng nhập password')
          .notEmpty().withMessage('Không được để trống password')
          .isLength({min: 6}).withMessage('Password phải từ 6 kí tự'),

     check('rePassword').exists().withMessage('Vui lòng xác nhận mật khẩu')
          .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
          .custom((value, {req}) => {
               if (value != req.body.password) {
                    throw new Error('Password không khớp')
               }

               return true
          })
]

Router.get('/register', (req,res) => {
     //Nhận error message từ flash
     const error = req.flash('error') || ''

     res.render('register', {error})
})
//Sử dụng validator làm middleware để xử lí dữ liệu gửi lên server
Router.post('/register', registerValidator, (req,res) => {
     //Nhận kết quả kiểm tra từ validator
     let  result = validationResult(req)

     if (result.errors.length === 0) {
          const {name, email, password} = req.body

          //Hash và lấy kết quả hash
          const hashedPassword = bcrypt.hashSync(password, 10)

          //Thêm dữ liệu từ client vào db
          const sqlQuery = `insert into account(name, email, password)
                              values(?,?,?)`
          const params = [name, email, hashedPassword]
          db.query(sqlQuery, params, (err, result, fields) => {
               if (err) { 
                    //Trả về error bằng flash cho /register để hiển thị
                    req.flash('error', err.message)
                    res.redirect('/user/register')
               }
               else if (result.affectedRows === 1) {
                    return res.redirect('/user/login')
               }
               
               //Trả về error bằng flash cho /register để hiển thị
               req.flash('error', 'Đăng kí thất bại')
               res.redirect('/user/register')
          })

          return
     } 

     let message
     result = result.mapped()
     console.log(result)
     for (fields in result) {
          message = result[fields].msg
          break
     }

     //Gửi flash error cho server trước khi điều hướng
     req.flash('error', message)
     res.redirect('/user/register')
})

Router.get('/logout', (req,res) => {
     //Xóa một vài thông tin trong session
     //(trong trường hợp các chức năng riêng)
     req.session.user = null

     //Xóa toàn bộ session
     req.session.destroy()
})

module.exports = Router