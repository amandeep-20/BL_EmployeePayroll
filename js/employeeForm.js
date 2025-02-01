const form = document.querySelector('#employeeForm');
const url = "http://localhost:3000/employeeList";

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    if (!/^[A-Za-z\s]+$/.test(name)) {
        alert('Name must contain letters only');
        return;
    }

    const profileImage = document.querySelector("input[name='profile-image']:checked")?.value || "";
    if (!profileImage) {
        alert('Please select a profile image');
        return;
    }

    const gender = document.querySelector("input[name='profile-gender']:checked")?.value || "";
    if (!gender) {
        alert('Please select a gender');
        return;
    }

    const department = Array.from(document.querySelectorAll("input[name='department']:checked")).map(element => element?.value);
    if (department.length === 0) {
        alert('Please select at least one department');
        return;
    }

    const salary = document.getElementById("salary").value.trim();
    const day = document.getElementById("day").value.trim();
    const month = document.getElementById("month").value.trim();
    const year = document.getElementById("year").value.trim();
    const notes = document.getElementById("notes").value.trim();

    const newEmployee = {
        name,
        profileImage,
        gender,
        department,
        salary,
        startDate: { day, month, year },
        notes
    };

    const employee = JSON.parse(localStorage.getItem('employeeToEdit'));
    if (!employee) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEmployee)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to register new employee!");
                }
                window.location.href = "Dashboard.html";
                alert("Employee registered successfully");
            })
            .catch(err => {
                alert(err.message);
            });
    } else {
        fetch(`${url}/${employee.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newEmployee)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update employee!");
                }
                window.location.href = "Dashboard.html";
                alert("Employee updated successfully");
                localStorage.removeItem('employeeToEdit')
            })
            .catch(err => {
                alert(err.message);
            });
    }

});


form.addEventListener("reset", (e) => {
    if (!confirm('Are you sure you want to reset the form?')) {
        e.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const employee = JSON.parse(localStorage.getItem('employeeToEdit'));

    if (employee) {
        if (employee) {
            document.getElementById("name").value = employee.name;
            document.getElementById("salary").value = employee.salary;
            document.getElementById("day").value = employee.startDate.day;
            document.getElementById("month").value = employee.startDate.month;
            document.getElementById("year").value = employee.startDate.year;
            document.getElementById("notes").value = employee.notes;

            document.querySelector(`input[name='profile-image'][value='${employee.profileImage}']`).checked = true;
            document.querySelector(`input[name='profile-gender'][value='${employee.gender}']`).checked = true;

            employee.department.forEach(dept => {
                document.querySelector(`input[name='department'][value='${dept}']`).checked = true;
            });
        } else {
            alert('Invalid employee data');
        }
    }
});
