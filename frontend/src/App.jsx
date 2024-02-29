import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [name, setName] = useState("");
  const [data, setData] = useState({ people: [] });
  const [hist, setHist] = useState(null);

  //image capture function
  const capture = useCallback(async () => {
    const imageSrc = await webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const recognise = () => {
    console.log(imgSrc.slice("data:image/webp;base64,".length));
    fetch("http://localhost:3000/recognise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frame: imgSrc.slice("data:image/webp;base64,".length),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Data sent successfully:", result);
      })
      .catch((error) => {
        console.error("Error sending data:", error.message);
      });
  };

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Call a function to send the data to the server
    register(name);

    // Optionally, clear the input field after submission
    setName("");
  };

  const register = () => {
    fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        frame: imgSrc.slice("data:image/webp;base64,".length),
        feature_vector: [],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Data sent successfully:", result);
      })
      .catch((error) => {
        console.error("Error sending data:", error.message);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000/people")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setData(res);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/history")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setHist(res);
      });
  }, []);

  return (
    <div>
      {/* webcam */}
      <div className="container">
        {imgSrc ? (
          <img src={imgSrc} alt="webcam" />
        ) : (
          <Webcam height={600} width={600} ref={webcamRef} />
        )}
        <div className="btn-container">
          {imgSrc ? (
            <button onClick={retake}>Retake photo</button>
          ) : (
            <button onClick={capture}>Capture photo</button>
          )}
        </div>
      </div>

      {/* recognise */}
      <div>
        <button onClick={recognise}>Check Face</button>
      </div>

      {/* register form */}
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input type="text" value={name} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>------------------------------------------------------------</div>
      <pre>{JSON.stringify(hist, null, 2)}</pre>
    </div>
  );
}

export default App;
