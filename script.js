
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


const images = document.querySelectorAll('.image')
const active_image = document.querySelector('.image.active')
const close_btn = document.querySelector('.close-btn')

images.forEach(img => {
    img.addEventListener('click', () => {
        images.forEach(i => i.classList.remove('active'))
        img.classList.add('active')
        close_btn.classList.add('active')
    })
})

if (close_btn) {
    close_btn.addEventListener('click', () => {
        images.forEach(i => i.classList.remove('active'))
        close_btn.classList.remove('active')
    })
}

const music = document.querySelector('.music-player audio')
const music_icon = document.querySelector('.music-icon')

music_icon.addEventListener('click', () => {
    if (music.paused) {
        music.play()
        music_icon.textContent = '⏸'
    } else {
        music.pause()
        music_icon.textContent = '▶'
    }
})