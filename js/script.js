// const employeeData = JSON.parse(localStorage.getItem("employees"));
// console.log(employeeData);
const apiUrl = "http://localhost:3000/employeeList"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let tableData = []

console.log("into the script file")
$(document).ready(() => {
    fetchData()
        .then((employeeData) => {
            tableData = employeeData
            console.log("tableData", tableData)
            populateTable(tableData)
        }).catch(err => {
            console.log(err.message)
        })
});

function populateTable(tableData) {
    const tableContainer = $(".emp-dash-table");
    const tableBody = $(".emp-dash-table-body");

    tableBody.empty(); // Clear existing table rows

    if (!tableData || tableData.length === 0) {
        tableContainer.html('<p class="empty-message">No employees found.</p>');
    } else {
        tableContainer.html(`
            <table class="emp-dash-table-content">
                <thead class="emp-dash-table-header">
                    <tr>
                        <td>NAME</td>
                        <td>EMAIL</td>
                        <td>POSITION</td>
                        <td>SALARY</td>
                        <td>DEPARTMENT</td>
                        <td>ACTION</td>
                    </tr>
                </thead>
                <tbody class="emp-dash-table-body"></tbody>
            </table>
        `);

        tableData.forEach((employee) => {
            const departmentHTML = employee.department
                .map((dept) => `<span class="emp-dash-tag">${capitalizeFirstLetter(dept)}</span>`)
                .join("");

            const dateString = `${employee.startDate.day} ${months[employee.startDate.month - 1]} ${employee.startDate.year}`;

            const row = `
            <tr>
                <td>
                    <div class="emp-dash-table-body-img">
                        <img src="${employee.profileImage}" alt="Profile Image" />
                        <span>${capitalizeFirstLetter(employee.name)}</span>
                    </div>
                </td>
                <td>${capitalizeFirstLetter(employee.gender)}</td>
                <td>${departmentHTML}</td>
                <td>${employee.salary}</td>
                <td>${dateString}</td>
                <td>
                    <i onclick="deleteEmployee('${employee.id}')" class="delete-icon">🗑️</i>
                    <i onclick="editEmployee('${employee.id}')" class="edit-icon">✏️</i>
                </td>
            </tr>`;

            $(".emp-dash-table-body").append(row);
        });
    }
}


function fetchData() {
    return new Promise((res, rej) => {
        $.ajax({
            type: "GET",
            url: apiUrl,
            success: (employeeData) => {
                res(employeeData)
            },
            error: (err) => {
                console.log(err.message)
                rej(err)
            }
        },
        )
    })
}

function deleteEmployee(employeeId) {
    console.log("employeeId", employeeId)
    $.ajax({
        type: "DELETE",
        url: `${apiUrl}/${employeeId}`,
        success: () => {
            alert("Employee deleted succesfully!")
            window.location.reload();

        },
        error: (err) => {
            console.log(err.message)
        }
    })
}

function editEmployee(index) {
    $.get(`${apiUrl}/${index}`, function (data) {
        // console.log(data)
        localStorage.setItem("employeeToEdit", JSON.stringify(data));
        window.location.href = "empForm.html";
    })
}

function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function searchByName() {
    const inputValue = $('#emp-main-search_box').val()
    // console.log(inputValue)
    fetchData()
        .then(data => {
            tableData = data.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))
            populateTable(tableData)
        })

}