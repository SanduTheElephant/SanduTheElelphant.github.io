window.addEventListener('DOMContentLoaded', function() {
  const flame = document.querySelector('.flame');
  const birthdayText = document.querySelector('.birthday-text');
  let flameExtinguished = false;

  // Get access to the microphone
  navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          function detectNoise() {
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

              if (average > 100 && !flameExtinguished) {
                  flame.style.opacity = '0';
                  document.querySelector('.wish').style.opacity = '0';
                  birthdayText.style.opacity = '1';
                  flameExtinguished = true;

                  // Set a timeout to redirect after 10 seconds
                  setTimeout(function() {
                      window.location.href = 'home.html';
                  }, 10000);
              }

              if (!flameExtinguished) {
                  requestAnimationFrame(detectNoise);
              }
          }

          detectNoise();
      })
      .catch(function(error) {
          console.error('Error accessing microphone:', error);
      });
});

// JavaScript for slider functionality
const sliders = document.querySelectorAll('.container');

sliders.forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1;
    slider.scrollLeft = scrollLeft - walk;
  });
});
