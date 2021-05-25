const { query } = require("express")
const queryString = require("querystring")

const myParser = (req,res,next) => { 
     body = ""
     
     //Tiếp nhận và xử lí data của req
     req.on("data", d => { 
          body += d.toString()
     })

     //Dừng nhận data
     req.on("end", () =>  {
          let data = queryString.decode(body)

          console.log("BEGIN MIDDLEWARE=====")
          console.log(data)
          console.log("END MIDDLEWARE=====")

          //Kết thúc middleware để chạy các middleware khác
          next()
     })
     
     //Tiếp nhận error từ req
     req.on("error", e => {
          throw e
     })
}

module.exports = myParser