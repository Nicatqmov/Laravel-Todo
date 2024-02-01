const Form = document.getElementById('taskForm')
const TaskInput = document.getElementById('task')
const DateInput = document.getElementById('date')
const deleteTaskButton = document.querySelectorAll('#deleteTask')
const editTaskButton = document.querySelectorAll('#editTask')
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const taskContainer = document.querySelector(".taskContainer")


//alerts--------------------------
const dangerClass = 'alert alert-warning alert-dismissible fade in'
const successClass = 'alert alert-success alert-dismissible fade in'
function addSuccessAlert(message, classNameadd) {
    var alertDiv = document.createElement("div");
    alertDiv.className = `${classNameadd}`;
    alertDiv.innerHTML = `
        <a class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Success!</strong> ${message}
    `;

    document.getElementById("alerts").appendChild(alertDiv);

    setTimeout(function () {
        alertDiv.remove();
    }, 2000);
}
//end alerts--------------------------

//date input--------------------------
const currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth = currentDate.getMonth() + 1;
let currentYear = currentDate.getFullYear();
if (currentMonth < 10) {
    currentMonth = "0" + currentMonth
}
DateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
//end date input--------------------------


//add task--------------------------
Form.addEventListener('submit', (e) => {
    e.preventDefault()
    const Task = TaskInput.value
    const Date = DateInput.value
    if (Task.trim() !== '' && Date.trim() !== '') {
        TaskInput.value = ''
        const taskData = {
            task: Task,
            date: Date,
        }
        fetch('/tasks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify(taskData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                const taskId = data.task_id;

                addSuccessAlert("New task added successfully!", successClass);

                const newTaskElement = document.createElement('ul');
                newTaskElement.id = 'taskContainer';
                newTaskElement.className = 'list-group list-group-horizontal rounded-0';
                newTaskElement.innerHTML = `
                    <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                        <div class="form-check">
                            <input class="form-check-input me-0" type="checkbox" value="" id="flexCheckChecked1" aria-label="..." checked />
                        </div>
                    </li>
                    <li  id='${taskId}' class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                        <p class="lead fw-normal mb-0">${taskData.task}</p>
                    </li>
                    <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
                        <div class="d-flex flex-row justify-content-end mb-1">
                        <button id="editTask" style="border:none" data-info='${taskId}'  class="text-info" data-mdb-toggle="tooltip" title="Edit todo"><i
                        class="fas fa-pencil-alt me-3"></i></button>
                            <button onclick="" id="deleteTask" class="text-danger" style="border:none" data-info='${taskId}' data-mdb-toggle="tooltip" title="Delete todo"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        <div class="text-end text-muted">
                            <a href="#!" class="text-muted" data-mdb-toggle="tooltip" title="Created date">
                                <p class="small mb-0"><i class="fas fa-info-circle me-2"></i>${taskData.date}</p>
                            </a>
                        </div>
                    </li>
                `;
                taskContainer.appendChild(newTaskElement);
                //remove current task--------------------------
                const deleteButton = newTaskElement.querySelector('#deleteTask');
                deleteButton.addEventListener('click', () => {
                    const taskID = deleteButton.dataset.info;
                    const taskElement = deleteButton.closest('ul');
                    taskElement.remove();

                    fetch('/tasks/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        },
                        body: JSON.stringify({ taskID: taskID })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok.');
                            }
                            addSuccessAlert("Task Deleted Succesfuly", successClass)
                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });
                });


                //end remove current task--------------------------


                //edit task--------------------------

                const editButton = newTaskElement.querySelector('#editTask');
                editbtn.addEventListener('click', () => {
                    const taskID = editbtn.dataset.info;
                    const liElement = document.getElementById(`${taskID}`)
                    const existingInput = liElement.querySelector('input');
                    const existingP = liElement.querySelector('p');

                    if (existingInput) {
                        existingInput.remove();
                        existingP.style.display = 'block'

                    } else {
                        existingP.style.display = 'none'
                        const inputElement = document.createElement('input');
                        inputElement.value = existingP.textContent
                        liElement.appendChild(inputElement);
                        inputElement.focus();
                    }

                })

                //end edit task--------------------------


            })


    } else {
        addSuccessAlert('Input(s) are empty!', dangerClass)
    }
})

//remove DB task--------------------------
deleteTaskButton.forEach((dltbtn) => {
    dltbtn.addEventListener('click', () => {
        const taskID = dltbtn.dataset.info;
        const taskElement = dltbtn.closest('ul');
        taskElement.remove();

        fetch('/tasks/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ taskID: taskID })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                addSuccessAlert("Task Deleted Succesfuly", successClass)
            })
            .catch(error => {
                console.error('There was a problem with the POST request:', error);
            });
    })
})

//end remove DB task--------------------------



//edit tasks--------------------------
editTaskButton.forEach((editbtn) => {
    editbtn.addEventListener("click", () => {
        const taskID = editbtn.dataset.info;
        const liElement = document.getElementById(`${taskID}`)
        const existingInput = liElement.querySelector('input');
        const existingP = liElement.querySelector('p');

        if (existingInput) {
            existingInput.remove();
            existingP.style.display = 'block'

        } else {
            existingP.style.display = 'none'
            const inputElement = document.createElement('input');
            inputElement.value = existingP.textContent
            liElement.appendChild(inputElement);
            inputElement.focus();
        }


    })
})

//end edit tasks--------------------------

