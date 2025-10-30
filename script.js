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
    // audioPlayer.volume = 0.9
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

document.addEventListener('DOMContentLoaded', () => {
  const music_player = document.querySelector('#music-player');
  const music_source = document.querySelector('#music-source');

  const getSrc = () => (
    (music_source && music_source.getAttribute('src')) ||
    music_player.getAttribute('src') ||
    (music_player.querySelector('source[src]')?.getAttribute('src')) ||
    null
  );

  let src = getSrc();
  const keyTime = () => 'musicTime::' + (src || 'unknown');
  const keySrc = 'musicSrc';

  let restored = false;

  function restoreTimePersistent() {
    const savedSrc = localStorage.getItem(keySrc);
    const savedTime = parseFloat(localStorage.getItem(keyTime()));
    if (!savedSrc || savedSrc !== src || isNaN(savedTime)) return;

    let tries = 0;
    const tryRestore = () => {
      if (music_player.readyState > 0 && music_player.duration > 0) {
        try {
          music_player.currentTime = Math.min(savedTime, music_player.duration - 0.2);
          restored = true;
          console.log(`Restored at ${music_player.currentTime.toFixed(2)}s`);
        } catch (e) {
          console.warn('Could not set currentTime:', e);
        }
      } else if (tries < 12 && !restored) {
        tries++;
        setTimeout(tryRestore, 250);
      }
    };
    tryRestore();
  }

  const whenReady = () => {
    src = getSrc();
    if (src) restoreTimePersistent();
  };

  if (music_player.readyState > 0) {
    whenReady();
  } else {
    music_player.addEventListener('loadedmetadata', whenReady, { once: true });
  }

  let lastSave = 0;
  music_player.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (!isNaN(music_player.currentTime) && src && now - lastSave > 1000) {
      localStorage.setItem(keyTime(), music_player.currentTime);
      localStorage.setItem(keySrc, src);
      lastSave = now;
    }
  });

  document.addEventListener('click', () => {
    if (music_player.paused) {
      music_player.play().catch(err => console.warn('Autoplay blocked:', err));
    }
  }, { once: true });
});
