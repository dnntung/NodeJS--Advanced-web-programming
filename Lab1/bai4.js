$(document).ready(()=> {

    let localStudents = JSON.parse(window.localStorage.getItem("students"))
    if (!localStudents){ 
        localStudents = []
    }
    localStudents.forEach(s => displayStudent(s, 'table1'));

    let sessionStudents = JSON.parse(window.localStorage.getItem("students"))
    if (!sessionStudents){ 
        sessionStudents = []
    }
    sessionStudents.forEach(s => displayStudent(s, 'table2'));

    $(`#btnLocal`).click(()=>{ 
        let name = $("#name").val()
        let age = $("#age").val()
        let id = localStudents.length + 1

        $("#name").val("")
        $("#age").val("")

        student = {id: id, name: name, age: age}
        localStudents.push(student)
        window.localStorage.setItem("students", JSON.stringify(localStudents))
        displayStudent(student, 'table1')
    })

    $(`#btnSession`).click(()=>{ 
        let name = $("#name").val()
        let age = $("#age").val()
        let id = sessionStudents.length + 1


        $("#name").val("")
        $("#age").val("")

        student = {id: id, name: name, age: age}
        sessionStudents.push(student)
        window.sessionStorage.setItem("students", JSON.stringify(sessionStorage))
        displayStudent(student, 'table2')
    })
})

function displayStudent(student,id){ 
    let tbody = $(`#${id}`)
    tbody.append(`
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
        </tr>
    `)
}