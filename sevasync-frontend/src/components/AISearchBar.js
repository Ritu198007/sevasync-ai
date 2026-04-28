import React, { useState } from "react";
import { FiSearch, FiMic, FiCamera } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AISearchBar.css";

const AISearchBar = ({ language }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const detectIntent = (text) => {
    const q = text.toLowerCase();

    if (q.includes("fire")) return "fire";
    if (q.includes("doctor") || q.includes("medical")) return "medical";
    if (q.includes("accident")) return "accident";
    if (q.includes("disaster")) return "disaster";
    if (q.includes("food")) return "food";
    if (q.includes("help")) return "general";

    return "ai";
  };

  const handleSearch = async (customQuery) => {
    const finalQuery = customQuery || query;
    if (!finalQuery) return;

    const intent = detectIntent(finalQuery);

    if (intent === "fire") {
      setResponse("🔥 Fire emergency detected. Use SOS immediately.");
      return;
    }

    if (intent === "medical") {
      setResponse("🏥 Opening medical help...");
      navigate("/help/medical");
      return;
    }

    if (intent === "accident") {
      setResponse("🚗 Accident detected. Trigger SOS if needed.");
      return;
    }

    if (intent === "food") {
      navigate("/help/food");
      return;
    }

    try {
      setLoading(true);
      setResponse("");

      const res = await axios.post(
        "http://localhost:5000/api/ai/ask",
        {
          prompt: finalQuery,
          language: language
        }
      );

      setResponse(res.data.reply);

    } catch (err) {
      setResponse("⚠️ Unable to connect to AI service");
    } finally {
      setLoading(false);
    }
  };

  const handleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language || "en-GB";
    recognition.start();

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setQuery(speechText);
      handleSearch(speechText);
    };

    recognition.onerror = () => {
      setResponse("⚠️ Mic error. Try again.");
    };
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setResponse("📷 Camera ready (AI vision coming soon)");
    } catch {
      setResponse("⚠️ Camera permission denied");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="ai-bar">
        <FiSearch className="icon left" onClick={() => handleSearch()} />

        <input
          type="text"
          placeholder="Ask for help, emergency, or support..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <div className="icons-right">
          <FiMic className="icon" onClick={handleMic} />
          <FiCamera className="icon" onClick={handleCamera} />
        </div>
      </div>

      {(loading || response) && (
        <div className="ai-response-box">
          {loading ? "Thinking..." : response}
        </div>
      )}
    </>
  );
};

export default AISearchBar;