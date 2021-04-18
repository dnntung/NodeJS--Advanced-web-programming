const express = require('express')
const {validationResult} = require('express-validator')
const db = require('../db')
const bcrypt = require('bcrypt')
const fs = require('fs')

const loginValidator = require('./validators/loginValidator')
const registerValidator = require('./validators/registerValidator')

const Router = express.Router()

Router.get('/login', (req, res) => {

    if (req.session.user) {
        return res.redirect('/')
    }

    const error = req.flash('error') || ''
    const password = req.flash('password') || ''
    const email = req.flash('email') || ''

    res.render('login', {error, password, email})
})

Router.post('/login', loginValidator,  (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const {email, password} = req.body
        
        const sql = 'SELECT * FROM account WHERE email = ?'
        const params = [email]

        db.query(sql, params, (err, results, fields) => {
            if (err) {
                req.flash('error', err.message)
                req.flash('password', password)
                req.flash('email', email)
                return res.redirect('/user/login')
            }else if (results.length === 0){
                req.flash('error', 'Email không tồn tại')
                req.flash('password', password)
                req.flash('email', email)
                return res.redirect('/user/login')
            }else {
                const hashed = results[0].password
                const match = bcrypt.compareSync(password, hashed)
                if (!match) {
                    req.flash('error', 'Mật khẩu không chính xác')
                    req.flash('password', password)
                    req.flash('email', email)
                    return res.redirect('/user/login')
                }else {
                    //delete results[0].password
                    req.session.user = results[0]
                    return res.redirect('/')
                }
            }
        })
        
    }
    else {
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg 
            break;
        }
    
        const {email, password} = req.body 
        
        req.flash('error', message)
        req.flash('password', password)
        req.flash('email', email)
        
        res.redirect('/user/login')
    }
})

Router.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    
    
    res.render('register', {error, name, email})
})

Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req);
    
    if (result.errors.length === 0) {
        const {name, email, password} = req.body
        const hashed = bcrypt.hashSync(password, 10)

        const sql = 'insert into account(name, email, password) values(?,?,?)'
        const params = [name, email, hashed]

        db.query(sql, params, (err, result, fields) => {
            if (err) {
                req.flash('error', err.message)
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/user/register')
            }
            else if (result.affectedRows === 1) {
                // đăng ký thành công
                return res.redirect('/user/login')   
            }
            else {
                req.flash('error', 'Đăng ký thất bại')
                req.flash('name', name)
                req.flash('email', email)
                
                return res.redirect('/user/register')
            }
        })
    }
    else {
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg 
            break;
        }
    
        const {name, email, password} = req.body 
        
        req.flash('error', message)
        req.flash('name', name)
        req.flash('email', email)
        
        res.redirect('/user/register')
    }
})

Router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login')
})

module.exports = Router

