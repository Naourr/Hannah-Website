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
if (music_icon) {
    music_icon.addEventListener('click', () => {
        if (music.paused) {
            music.play() 
            music_icon.innerHTML = '■'
        } else {
            music.pause()
            music_icon.innerHTML = '▶'
        }
    })
}

const sounds = ['/assets/audios/yummy.mp3', '/assets/audios/nomx3.mp3', '/assets/audios/mm-chavez.mp3', '/assets/audios/mm-chezburger.mp3', '/assets/audios/pizza.mp3'];
function clicked() {
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');

    const mp3Path = getRandFromArray(sounds)

    audioSource.src = mp3Path;
    audioPlayer.load();
    audioPlayer.volume = 0.5
    audioPlayer.play();
}

document.addEventListener('click', () => {
    clicked()
})

function getRandFromArray(arr) {
    const randomNumber = Math.random();
    const scaledNumber = randomNumber * arr.length;
    const randomIndex = Math.floor(scaledNumber);
    return arr[randomIndex];
}

