const http = require("http")
const URL = require('url')
const queryString = require("querystring")
const fs = require('fs')
const path = require('path')

const server = http.createServer((req,res) => { 

    res.writeHead(200, { 
        "Content-Type":"text/html"
    })

    let url = URL.parse(req.url)

    if (url.pathname === "/"){ 
        let html = fs.readFileSync(path.join(__dirname,'views/login.html'))
        
        return res.end(html)
    }
    if (url.pathname === "/success"){ 
        let html = fs.readFileSync(path.join(__dirname,'views/success.html'))
        
        return res.end(html)
    }
    if (url.pathname === "/fail"){ 
        let html = fs.readFileSync(path.join(__dirname,'views/fail.html'))
        
        return res.end(html)
    }
    if (url.pathname === "/login"){ 
        return handleLogin(req,res)
    }
    let html = fs.readFileSync(path.join(__dirname, 'views/fail.html')).toString()
    html = html.replace("xxxxxxxxxx", `Đường dẫn không phù hợp`)

    res.end(html)
})

function handleLogin(req,res){ 
    if (req.method !== "POST"){ 
        let html = fs.readFileSync(path.join(__dirname, 'views/fail.html')).toString()
        html = html.replace("xxxxxxxxxx", `Phương thức ${req.method} không được hỗ trợ`)
        return res.end(html)
    } 

    let body = ""
    req.on('data', d => body += d.toString())
    req.on("end", ()=>{ 
        let html = fs.readFileSync(path.join(__dirname, 'views/fail.html')).toString()
        let input = queryString.decode(body)
        if (!input.email){ 
            return res.end(html.replace("xxxxxxxxxx", `Thiếu email!`))
        }
        if (!input.email.includes("@")){ 
            return res.end(html.replace("xxxxxxxxxx", `Email không phù hợp!`))
        }
        if (!input.password){ 
            return res.end(html.replace("xxxxxxxxxx", `Thiếu password!`))
        }
        if (input.password.length < 6){ 
            return res.end(html.replace("xxxxxxxxxx", `Mật khẩu không phù hợp!`))
        }
        if (input.email != "admin@gmail.com" || input.password!="123456"){ 
            return res.end(html.replace("xxxxxxxxxx", `Sai tài khoản hoặc mật khẩu!`))
        }

        html = fs.readFileSync(path.join(__dirname, 'views/success.html')).toString()

        return res.end(html)
    })
}

server.listen(8080, () => { 
    console.log("Server is listening at http://localhost:8080")
})