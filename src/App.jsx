import { useState } from 'react';
// import Confetti from 'react-confetti/dist/types/Confetti';
import Confetti from 'react-confetti';

function App() {
  const [count, setCount] = useState(0);
  const [celebration, setCelebration] = useState(false);
  async function getMedia(constraints) {
    try {
      const audio = new Audio();

      audio.srcObject = await navigator.mediaDevices.getUserMedia(constraints);

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audio.srcObject);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function detectSpeech() {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        if (average > 50) {
          setCount((oldCount) => oldCount + 1);
          if (count === 5) {
            setCelebration(true);
          }
        }

        requestAnimationFrame(detectSpeech);
      }

      detectSpeech();
    } catch (err) {
      console.log(err);
    }
  }
  const constraints = {
    audio: true,
    video: false,
  };

  getMedia(constraints);

  return (
    <>
      <div className="header">
        <h1>Happy birthday</h1>
      </div>
      <div className="content">
        <p>Cake pic</p>
        {celebration && <Confetti />}
      </div>
    </>
  );
}

export default App;
