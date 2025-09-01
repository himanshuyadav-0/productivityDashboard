
function openFeatures() {
    let allElems = document.querySelectorAll('.elem')
    let FullElemPage = document.querySelectorAll('.fullElem')
    let FullElemsBackBtn = document.querySelectorAll(".fullElem .back")
    let nav = document.querySelector("nav")
    let landing = document.querySelector(".allElems");
    let allFeatures = document.querySelector(".allFeatures");

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            FullElemPage[elem.id].style.display = "block";
            nav.style.display = "none"
            allElems.forEach(e => {
                e.style.display = 'none'
            })

        })
    })

    FullElemsBackBtn.forEach(function (back) {
        back.addEventListener("click", function () {
            FullElemPage[back.id].style.display = "none";
            nav.style.display = "block"
           
  allElems.forEach(e => {
                e.style.display = 'block';
            });


        })
    })

}
openFeatures()
function todolist() {
    let form = document.querySelector(".addTask form")
    let taskInput = document.querySelector(" .addTask #task-input")
    let taskDetailsInput = document.querySelector(" .addTask form textarea")
    let taskCheckbox = document.querySelector(".addTask form #check")

    var currentTask = []
    if (localStorage.getItem("currentTask")) {
        currentTask = JSON.parse(localStorage.getItem("currentTask",))

    } else {
        console.log("task list is empty")
    }

    function renderTask() {
        localStorage.setItem("currentTask", JSON.stringify(currentTask))
        let allTask = document.querySelector(".allTasks");
        let sum = "";

        currentTask.forEach(function (elem, index) {
            sum += `
        <div class="task">
            <div class="task-header">
                <h5>${elem.task}<span class="${elem.imp}"> imp</span></h5>
            </div>
            <div class="task-actions">
                <button class="detail-btn" data-index="${index}">Details</button>
                <button class="markBtn" id="${index}">Mark As Completed</button>
            </div>
        </div>
        <div class="details-card" style="display: none;">
            <p>${elem.details}</p>
        </div>`;
        });

        allTask.innerHTML = sum;

        const detailBtns = document.querySelectorAll(".detail-btn");
        detailBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                const taskCard = btn.closest(".task");
                const detailsCard = taskCard.nextElementSibling;


                if (detailsCard.style.display === "none" || !detailsCard.style.display) {
                    detailsCard.style.display = "block";
                } else {
                    detailsCard.style.display = "none";
                }
            });
        });
        localStorage.setItem("currentTask", JSON.stringify(currentTask))
        const markCompleteBtn = document.querySelectorAll(".task .task-actions .markBtn");

        markCompleteBtn.forEach(function (btn) {
            btn.addEventListener("click", function () {
                currentTask.splice(btn.id, 1)
                renderTask();

            })


        })

    }
    renderTask();

    form.addEventListener("submit", function (e) {
        e.preventDefault()

        if (taskInput.value.trim() === "") {
            const existingErrors = form.querySelectorAll(".error-msg");
            if (existingErrors.length < 2) {
                let error = document.createElement("p");
                error.innerText = "Task name cannot be empty!";
                error.classList.add("error-msg");
                error.style.color = "red";
                form.appendChild(error);
                setTimeout(() => error.remove(), 2000);
            }
            return;
        }


        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckbox.checked
            }
        );
        renderTask();
        taskInput.value = ""
        taskDetailsInput.value = ""
        taskCheckbox.checked = false
    })
}
todolist();
function dailyPlanner() {
    var dayPlanner = document.querySelector('.day-planner')

    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var hours = Array.from({ length: 18 }, function (_, idx) {
        return `${6 + idx}:00-${7 + idx}:00`
    })

    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {

        var savedData = dayPlanData[idx] || ''

        wholeDaySum = wholeDaySum + `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`
    })

    dayPlanner.innerHTML = wholeDaySum


    var dayPlannerInput = document.querySelectorAll('.day-planner input')
    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {

            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })

}
dailyPlanner()
function motivationQuote() {
    var motivationQuote = document.querySelector(".motivation-2 h1")
    var motivationAuthor = document.querySelector(".motivation-3 h2")
    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/quotes/random')
        let data = await response.json()
        motivationQuote.innerHTML = data[0].content
        motivationAuthor.innerHTML = data[0].author
    }
    fetchQuote()
}
motivationQuote()

function pomodoroTimer() {

    let timer = document.querySelector(".pomo-timer h1")
    let startBtn = document.querySelector(".pomo-timer .start-timer")
    let pauseBtn = document.querySelector(".pomo-timer .pause-timer")
    let resetBtn = document.querySelector(".pomo-timer .reset-timer")
    let session = document.querySelector(".pomodoro-fullpage .session")

    let timerInterval = null;
    let totalSeconds = 25 * 60
    let isWorkSession = true;
    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60
        timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    }

    function startTimer() {

        clearInterval(timerInterval)
        if (isWorkSession) {

            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval);
                    session.innerHTML = "Take A Break"
                    session.style.backgroundColor = "var(--tri2)"
                    session.style.color = "var(--tri1)"
                    timer.innerHTML = "05:00"
                    totalSeconds = 5 * 60;
                }
            }, 1000);
        }
        else {

            timerInterval = setInterval(() => {
                if (totalSeconds > 0) {
                    totalSeconds--;
                    updateTimer();
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval);
                    session.innerHTML = "Work Session"
                    session.style.backgroundColor = "var(--tri1)"
                    session.style.color = 'var(--sec)'
                    timer.innerHTML = "25:00"
                    totalSeconds = 25 * 60
                }
            }, 1000);
        }
    }


    function pauseTimer() {
        clearInterval(timerInterval)

    }
    function resetTimer() {
        clearInterval(timerInterval)
        totalSeconds = 1500
        isWorkSession = true;
        session.innerHTML = "Work Session";
        session.style.backgroundColor = "var(--tri1)";
        session.style.color = "initial";
        updateTimer()

    }



    startBtn.addEventListener("click", startTimer)
    pauseBtn.addEventListener("click", pauseTimer)
    resetBtn.addEventListener("click", resetTimer)
}
pomodoroTimer()

function weather() {



    let keyy = "2915dc9c22d849f3976193359251906"
    var city = "Jaipur"

    var header1Time = document.querySelector(".header1 h1")
    var header1Date = document.querySelector(".header1 h2")
    var city1 = document.querySelector('.header1 h4')
    var header2Temp = document.querySelector(".header2 h2")
    var header4Condition = document.querySelector(".header2 h4")

    var humidity = document.querySelector(".header2 .humidity")
    var wind = document.querySelector(".header2 .wind")

    async function weatherAPICall() {
        var response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${keyy}&q=${city}`)
        let data = await response.json();
        wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`

        humidity.innerHTML = `Humidity:${data.current.humidity}%`
        header2Temp.innerHTML = `${data.current.temp_c}°C`
        header4Condition.innerHTML = `${data.current.condition.text}`

    }
    weatherAPICall()


    function timeDate() {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        var dateData = new Date()
        var day = daysOfWeek[dateData.getDay()]
        var hours = dateData.getHours()
        var minutes = dateData.getMinutes()
        var seconds = dateData.getSeconds()
        var date = dateData.getDate()
        var month = monthsOfYear[dateData.getMonth()]
        var year = dateData.getFullYear()

        header1Date.innerHTML = `${date} ${month}, ${year}`
        city1.innerHTML = `${city}`

        if (hours > 12) {
            header1Time.innerHTML = `${day}, ${String(hours - 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} PM`
        } else {
            header1Time.innerHTML = `${day}, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} AM`
        }

    }

    setInterval(() => {
        timeDate()
    }, 1000)

}
weather();
function changeTheme(){

    var theme = document.querySelector(".theme")
var rootElement = document.documentElement
flag=0
theme.addEventListener('click', function () {

    if (flag == 0) {
        rootElement.style.setProperty('--pri', '#F2F2F2')
        rootElement.style.setProperty('--sec', '#393E46')
        rootElement.style.setProperty('--tri1', '#B6B09F')
        rootElement.style.setProperty('--tri2', '#948979')
        flag = 1
    } else if (flag == 1) {
        rootElement.style.setProperty('--pri', '#FAF0E6')
        rootElement.style.setProperty('--sec', '#352F44')
        rootElement.style.setProperty('--tri1', '#5C5470')
        rootElement.style.setProperty('--tri2', '#B9B4C7')
        flag = 2
    } else if (flag == 2) {
          rootElement.style.setProperty('--pri', '#F8F4E1')
        rootElement.style.setProperty('--sec', '#381c0a')
        rootElement.style.setProperty('--tri1', '#FEBA17')
        rootElement.style.setProperty('--tri2', '#74512D')
      
        flag = 0
    }
})
}
changeTheme()
const backgroundImages = {
    morning: "/morning.jpg",
    afternoon: 'https://images.unsplash.com/photo-1669832669337-758d928e7d45?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D ',
    evening: 'https://images.unsplash.com/photo-1668010210716-663cb60a8b80?q=80&w=1409&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D ',
    night: 'https://images.unsplash.com/photo-1652811231425-8b6f2a720989?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D '
};
function updateHeaderBackground() {
    const hour = new Date().getHours();
    let timeOfDay;

    if (hour >= 5 && hour < 12) {
        timeOfDay = "morning";
    } else if (hour >= 12 && hour < 17) {
        timeOfDay = "afternoon";
    } else if (hour >= 17 && hour < 20) {
        timeOfDay = "evening";
    } else {
        timeOfDay = "night";
    }

    const header = document.querySelector(".allElems header");
    header.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, 0.315), rgba(0, 0, 0, 0.6)), url('${backgroundImages[timeOfDay]}')`;
}
updateHeaderBackground()