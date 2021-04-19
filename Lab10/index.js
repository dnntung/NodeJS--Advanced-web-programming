require('dotenv').config()
let socketio = require('socket.io')
let express = require("express")

const app = express()
app.set('view engine', 'ejs')

app.get('/', (req,res) => {
     res.render('index')
})

app.get('/login', (req,res) => {
     res.render('login')
})

app.get('/chat', (req,res) => {
     res.render('login')
})

let port = process.env.PORT || 3000
let httpServer = app.listen(port, () => {
     console.log('http://localhost:'+port)
})
let io = socketio(httpServer)

io.on('connection', client => {
     /*
     //Lấy thông tin về các client đã kết nối
     let users = Array.from(io.sockets.sockets.values())
          //Chọn lọc các thông tin cần thiết và truyền nó vào 1 map mới
          .map(socket => ({
               id: socket.id,
               name: socket.name, 
               free: socket.free,
               loginAt: socket.loginAt
          }))
     */

     console.log(`Client ${client.id} đã kết nối`)

     //Thêm 2 thuộc tính cho client để hiển thị giao diện cho từng người dùng
     client.free = true
     client.loginAt = new Date().toLocaleDateString()

     client.on('disconnect', () => {
          console.log(`Client ${client.id} đã ngắt kết nối`)

          //Thông báo cho toàn bộ client khác client này đã ngắt kết nối
          //để xóa client này đi 
          client.broadcast.emit('user-leave', client.id)
     })

     //Nhận tên người dùng từ client
     client.on('register-name', name => {
          client.name = name

          //Gửi tên người dùng vừa đăng kí cho tất cả các usser còn lại
          client.broadcast.emit('register-name', {
               id: client.id, 
               name: client.name
          })
     })

     /*Xử lí sự kiện gửi tin nhắn và nhận tin nhắn từ server và client
     client.on('message', m => {
          console.log(`Đã nhận được tin nhắn từ client: ${m}`)
     })

     client.send('Hello, server đây!')
     */

     //Truyền users cho client
     //Do danh sách người dùng cần được cập nhật liên tục 
     // => phải dùng emit
     client.emit('list-users', Array.from(io.sockets.sockets.values())
          .map(socket => ({
               id: socket.id,
               name: socket.name, 
               free: socket.free,
               loginAt: socket.loginAt
          })))

     //Gửi thông tin user mới cho tất cả các user cũ
     client.broadcast.emit('new-user', {
          id: client.id,
          name: client.name,
          free: client.free,
          loginAt: client.loginAt
     })
     
})
