const http = require('http')
const URL =  require('url')
const queryString = require('querystring')

const server = http.createServer((req,res) => { 
    
    const url = URL.parse(req.url)

    res.writeHead(200, {
        'Content-Type':'text/html; charset=utf-8'
    })

    if (url.pathname === '/'){ 
        return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Tính toán cơ bản</title>
        </head>
        <body>
            <form action="/result" method="GET">
                <table>
                    <tr>
                        <td>Số hạng 1</td>
                        <td><input type="number" placeholder="Số 1" name="a" id="a"></td>
                    </tr>
                    <tr>
                        <td>Số hạng 2</td>
                        <td><input type="number" placeholder="Số 2" name="b" id="b"></td>
                    </tr>
                    <tr>
                        <td>Phép tính</td>
                        <td>
                            <select name="op" id="op">
                                <option value="">Chọn phép tính</option>
                                <option value="+">Cộng</option>
                                <option value="-">Trừ</option>
                                <option value="*">Nhân</option>
                                <option value="/">Chia</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="submit" value="Tính"></td>
                    </tr>
                </table>
                 
                 
                
                
        
            </form>
        </body>
        </html>
        `)
    }
    if (url.pathname === '/result'){ 
        let query = queryString.decode(url.query)
        console.log(query)

        if (!query.a){ 
            return res.end("Thiếu tham số a")
        }
        if (!query.b){ 
            return res.end("THiếu tham số b")
        }
        let ops = ['+','-','*','/']
        if (!ops.includes(query.op)){ 
            return res.end("Chưa chọn operation")
        }

        let a = parseInt(query.a)
        let b = parseInt(query.b)
        let ketQua = 0
        switch (query.op){ 
            case ('+'): 
                ketQua = a + b
                break
            case ('-'): 
                ketQua = a - b
                break
            case ('*'): 
                ketQua = a * b
                break
            case ('/'): 
                ketQua = a / b
                break
        }

        return res.end(`Kết quả: ${a} ${query.op} ${b} = ${ketQua}`)
    }
    res.end("Trang nay` chua duoc ho tro :D")

    console.log(url)
})

server.listen(8080, () => { 
    console.log("Server is running at http://localhost:8080")
})