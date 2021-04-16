const express = require('express')
const Router = express.Router()
const {validationResult} = require('express-validator')
const CheckLogin = require('../auth/CheckLogin.js')

const Product = require('../models/ProductModel')

const addProductValidator = require('./validators/addProductValidator')

Router.get('/', (req, res) => {
    Product.find().select('name price desc')
    .then(products => {
        res.json({
            code: 0,
            message: 'Đọc danh sách sản phẩm thành công',
            data: products
        })
    })
})

Router.post('/', CheckLogin, addProductValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {name, price, desc} = req.body
        let product = new Product({
            name, price, desc
        })

        product.save()
        .then(() => {
            return res.json({code: 0, message: 'Thêm sản phẩm thành công',
                data: product})
        })
        .catch(e => {
            return res.json({code: 2, message: e.message})
        })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m].msg
            break
        }
        return res.json({code: 1, message: message})
    }
})

Router.get('/:id', (req,res) => {
    let {id} = req.params
    if (!id) {
        return res.json({
            code:1, 
            message: 'Không có thông tin mã sản phẩm'
        })
    }
    Product.findById(id)
        .then(p => {
            if (!p) { 
                return res.json({
                    code: 0,
                    message: 'Đã tìm thấy sản phẩm', 
                    data: p
                })
            }
            else {
                return res.json({
                    code:2, 
                    message: 'Không tìm thấy sản phẩm yêu cầu'
                })
            }
        })
        .catch(e => { 
            if (e.message.include('Cast to ObjectId failed'))
            return res.json({
                code: 3, 
                message: 'Đây không phải là id hợp lệ'
            })
        })
})

Router.delete('/:id', CheckLogin, (req,res) => {
    let {id} = req.params
    if (!id) {
        return res.json({
            code:1, 
            message: 'Không có thông tin mã sản phẩm'
        })
    }
    Product.findByIdAndDelete(id)
        .then(p => {
            if (!p) { 
                return res.json({
                    code: 0,
                    message: 'Đã xóa sản phẩm', 
                    data: p
                })
            }
            else {
                return res.json({
                    code:2, 
                    message: 'Không tìm thấy sản phẩm yêu cầu'
                })
            }
        })
        .catch(e => { 
            if (e.message.include('Cast to ObjectId failed'))
            return res.json({
                code: 3, 
                message: 'Đây không phải là id hợp lệ'
            })
        })
})

Router.put('/:id', CheckLogin, (req,res) => {
    let {id} = req.params
    if (!id) {
        return res.json({
            code:1, 
            message: 'Không có thông tin mã sản phẩm'
        })
    }

    let supportedFields = ['name', 'price', 'desc']
    let updateData = req.body
    if (!updateData) {
        return res.json({
            code: 2, 
            message: 'Không có dữ liệu để cập nhật'
        })
    }

    for (field in updateData) { 
        if (!supportedFields.includes(field)) {
            delete updateData[field]
        }
    }

    Product.findByIdAndUpdate(id, updateData, {
        new: true
    })
        .then(p => {
            if (!p) { 
                return res.json({
                    code: 0,
                    message: 'Đã cập nhật thành công', 
                    data: p
                })
            }
            else {
                return res.json({
                    code:2, 
                    message: 'Không tìm thấy sản phẩm yêu cầu'
                })
            }
        })
        .catch(e => { 
            if (e.message.include('Cast to ObjectId failed'))
            return res.json({
                code: 3, 
                message: 'Đây không phải là id hợp lệ'
            })
        })
})

module.exports = Router