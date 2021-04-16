const {check} = require('express-validator')

module.exports = [
    check('name')
    .exists().withMessage('Vui lòng cung cấp tên sản phẩm')
    .notEmpty().withMessage('Tên sản phẩm không được để trống'),

    check('price')
    .exists().withMessage('Vui lòng cung cấp giá sản phẩm')
    .notEmpty().withMessage('Giá sản phẩm không được để trống')
    .isNumeric().withMessage('Giá phải là kiểu số'),

    check('desc')
    .exists().withMessage('Vui lòng cung cấp mô tả sản phẩm')
    .notEmpty().withMessage('Không được để trống mô tả sản phẩm'),
]