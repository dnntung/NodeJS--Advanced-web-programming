let btnFetch,btnAjax,tBody
const SERVER  = "https://web-nang-cao.herokuapp.com/lab1/students.json"

window.addEventListener("load", ()=> {
    console.log("Loaded!")
    
    btnAjax = document.getElementById("btnAjax")
    btnFetch = document.getElementById("btnFetch")
    tBody = document.getElementById("tBody")

    btnAjax.addEventListener("click", loadByAjax)
    btnFetch.addEventListener("click", loadByFetch)
})

function printData(json){ 
    let users = json.data

    tBody.innerHTML = ""

    users.forEach(u => {
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")

        td1.innerHTML = u.id
        td2.innerHTML = u.name
        td3.innerHTML = u.age

        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)

        tBody.appendChild(tr)
    });
}

function loadByAjax(){ 
    let xhr = new XMLHttpRequest()
    let API = 

    xhr.addEventListener("load", e => { 
        if (xhr.readyState === 4 && xhr.status === 200){ 
            let json = xhr.response

            printData(json)
        }
    })
    xhr.open("get", SERVER, true)
    xhr.responseType = "json"
    xhr.send()
}

function loadByFetch(){ 
    fetch(SERVER)
        .then(kq => kq.json())
        .then(json => printData(json))
        .catch(e => console.log(e))
}