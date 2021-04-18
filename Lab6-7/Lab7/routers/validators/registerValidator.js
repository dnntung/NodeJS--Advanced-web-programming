const {check} = require('express-validator')

const registerValidator = [
    check('name').exists().withMessage('Vui lòng nhập tên người dùng')
    .notEmpty().withMessage('Không được để trống tên người dùng')
    .isLength({min: 6}).withMessage('Tên người dùng phải từ 6 ký tự'),

    check('email').exists().withMessage('Vui lòng nhập email người dùng')
    .notEmpty().withMessage('Không được để trống email người dùng')
    .isEmail().withMessage('Đây không phải là email hợp lẹ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu không khớp')
        }
        return true;
    })
]

module.exports = registerValidator