const time = document.querySelector('.time')

function updateClock() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;

    time.textContent = `${hour}:${minute}`
}
setInterval(updateClock, 1000)