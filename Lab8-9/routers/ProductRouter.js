const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')

const Product = require('../models/ProductModel')

const addProductValidator = require('./validators/addProduct')

Router.get('/', (req,res) => { 
     Product.find().select('name price desc -_id')
     .then(products => {
          res.json({
               code: 0,
               message: "Đọc danh sách sản phẩm thành công",
               data: products
          })
     })
})

Router.post('/', addProductValidator, (req,res) => {
     let result = validationResult(req)
     //Kiểm tra có bất kì lỗi nào được trả về hay không
     if (result.errors.length === 0){
          const {name, price, desc} = req.body
          let product = new Product({
               name, price, desc
          })

          product.save()
          .then(() => { 
               return res.json({
                    code:0, 
                    message: "Thêm sản phẩm thành công",
                    data: product
               })
          })
          .catch(e => { 
               return res.json({
                    code:2, 
                    message: e.message
               })
          })
     }else{ 
          let messages = result.mapped()
          let message = ''
          for (m in messages){ 
               message = messages[m].msg
               break
          }
          return res.json({ 
               code:1, 
               message: message
          })
     }
})

module.exports = Router