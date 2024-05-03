// getting the html elements 
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

// Adding Hours, Minutes, Seconds in DropDown Menu at the start
window.addEventListener("DOMContentLoaded", (event) => {

    dropDownMenu(1, 12, setHours);

    dropDownMenu(0, 59, setMinutes);

    dropDownMenu(0, 59, setSeconds);

    // for updating time every second 
    setInterval(getCurrentTime, 1000);
    fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

// function for building the dropdown for different cases (Hour, Minute, Second)
function dropDownMenu(start, end, element) {
    for (let i = start; i <= end; i++) {
        const dropDown = document.createElement("option");
        dropDown.value = i < 10 ? "0" + i : i;
        dropDown.innerHTML = i < 10 ? "0" + i : i;
        element.appendChild(dropDown);
    }
}


function getCurrentTime() {
    let time = new Date();
    // converting time into hh:mm:ss am/pm 
    time = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    // updating the value of time into current time(clock)
    currentTime.innerHTML = time;

    return time;
}


function getInput(e) {
    e.preventDefault();
    // getting values from dropdown
    const hourValue = setHours.value;
    const minuteValue = setMinutes.value;
    const secondValue = setSeconds.value;
    const amPmValue = setAmPm.value;

    // getting the Alarm-Time
    const alarmTime = convertToTime(
        hourValue,
        minuteValue,
        secondValue,
        amPmValue
    );
    // setting the alarm
    setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
    return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// function to set alarm 
function setAlarm(time, fetching = false) {

    // setting interval for each alarm for time comparison
    const alarm = setInterval(() => {
        // checking if current time matches alarm time
        if (time === getCurrentTime()) {
            alert("Alarm Ringing");
        }
        console.log("running");
    }, 500);

    addAlaramToDom(time, alarm);
    if (!fetching) {
        saveAlarm(time);
    }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
    const alarm = document.createElement("div");
    alarm.classList.add("alarm", "mb", "d-flex");
    alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
    const deleteButton = alarm.querySelector(".delete-alarm");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

    alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
    let alarms = [];
    const isPresent = localStorage.getItem("alarms");
    // checking if alarm already present in local storage
    if (isPresent) alarms = JSON.parse(isPresent);

    return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
    const alarms = checkAlarams();

    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
    const alarms = checkAlarams();

    alarms.forEach((time) => {
        setAlarm(time, true);
    });
}

// for each alarm giving a delete button to delete the alarm
function deleteAlarm(event, time, intervalId) {
    const self = event.target;
    // When the user delete an alarm making sure it does not alert the user
    clearInterval(intervalId);

    const alarm = self.parentElement;
    console.log(time);
    // deleting from localstorage
    deleteAlarmFromLocal(time);
    alarm.remove();
}

// function to delete the alarm from the local storage 
function deleteAlarmFromLocal(time) {
    const alarms = checkAlarams();

    const index = alarms.indexOf(time);
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}