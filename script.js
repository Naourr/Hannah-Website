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








// (function () {
//   // prefer exact ids
//   const music_player = document.querySelector('#music-player') || document.querySelector('.music-player audio');
//   const music_source = document.querySelector('#music-source') || (music_player ? music_player.querySelector('source') : null);

//   if (!music_player) {
//     console.error('❌ No <audio> element found (expected #music-player or .music-player audio).');
//     return;
//   }
//   console.log('✅ Music element found:', music_player);

//   // determine the actual file src (try several places)
//   function getSrc() {
//     // 1) explicit source element with src attribute
//     if (music_source && music_source.getAttribute('src')) return music_source.getAttribute('src');
//     // 2) <audio src="..."> directly
//     if (music_player.getAttribute('src')) return music_player.getAttribute('src');
//     // 3) first <source> child with src
//     const childSource = music_player.querySelector('source[src]');
//     if (childSource) return childSource.getAttribute('src');
//     return null;
//   }

//   let src = getSrc();
//   if (!src) {
//     console.error('❌ No audio src found. Make sure either #music-source has a src or #music-player has a src attribute.');
//     // still attach timeupdate saving if audio exists (will do nothing until loaded)
//   } else {
//     // ensure the audio element has the src set (some browsers don't pick up <source> changes reliably)
//     if (music_player.getAttribute('src') !== src) {
//       try {
//         music_player.src = src;
//       } catch (e) {
//         console.warn('⚠️ Could not set audio.src directly:', e);
//       }
//     }
//     // force reload to pick up src if needed
//     try { music_player.load(); } catch (e) {}
//   }

//   // Use keys that include src so multiple songs don't override each other
//   const storageKeyTime = () => {
//     const s = (src || getSrc()) || 'unknown';
//     return 'musicTime::' + s;
//   };
//   const storageKeySrc = 'musicSrc'; // optional global pointer

//   // When data is ready, restore time if same song
//   music_player.addEventListener('loadeddata', () => {
//     // re-evaluate src in case it changed
//     src = getSrc() || music_player.getAttribute('src') || music_player.src;
//     const savedSrc = localStorage.getItem(storageKeySrc);
//     const savedTime = localStorage.getItem(storageKeyTime());

//     console.log('loadeddata — current src:', src, 'savedSrc:', savedSrc, 'savedTime:', savedTime);

//     // If saved src matches current src, restore time
//     if (savedSrc && savedSrc === src && savedTime) {
//       try {
//         music_player.currentTime = parseFloat(savedTime);
//         console.log('⏩ Restored time to', music_player.currentTime);
//       } catch (e) {
//         console.warn('⚠️ Could not set currentTime:', e);
//       }
//     }
//     // keep storage pointer to current src
//     if (src) localStorage.setItem(storageKeySrc, src);
//   });

//   // Save progress periodically
//   music_player.addEventListener('timeupdate', () => {
//     const cur = music_player.currentTime;
//     if (!isNaN(cur) && src) {
//       localStorage.setItem(storageKeyTime(), cur);
//       localStorage.setItem(storageKeySrc, src);
//     }
//   });

//   // Start playback after user interaction (autoplay policy)
//   function startOnInteraction() {
//     if (music_player.paused) {
//       music_player.play().then(() => {
//         console.log('▶️ Music playing after interaction');
//       }).catch(err => {
//         console.warn('⚠️ Play rejected (autoplay rules):', err);
//       });
//     }
//   }
//   document.addEventListener('click', startOnInteraction, { once: true });

//   // Helpful fallback: if the audio has an error, log it
//   music_player.addEventListener('error', (ev) => {
//     console.error('❌ Audio error event:', ev);
//     // log underlying media error details if present
//     if (music_player.error) console.error('MediaError:', music_player.error);
//   });

// })();
