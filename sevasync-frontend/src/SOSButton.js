import React, { useState, useRef } from 'react';
import axios from 'axios';

const SOSButton = () => {
    const [isPressing, setIsPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => reject(err),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0 // 🔥 IMPORTANT FIX
                }
            );
        });
    };

    const triggerEmergency = async (category = "General") => {
        if (loading) return;

        try {
            setLoading(true);
            setStatus(`🚨 Sending ${category} SOS...`);

            const { lat, lng } = await getLocation();

            let stream = null;
            let mediaRecorder = null;
            let chunks = [];

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                });

                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.start();

                await new Promise((resolve) => setTimeout(resolve, 5000));
                mediaRecorder.stop();

                await new Promise((resolve) => {
                    mediaRecorder.onstop = resolve;
                });

                const blob = new Blob(chunks, { type: 'video/webm' });
                const formData = new FormData();

                formData.append('video', blob);
                formData.append('lat', lat);
                formData.append('lng', lng);
                formData.append('category', category);

                await axios.post('http://localhost:5000/api/sos/trigger', formData);

                stream.getTracks().forEach(track => track.stop());

                setStatus(`✅ ${category} SOS Sent with video`);

            } catch (cameraError) {
                await axios.post('http://localhost:5000/api/sos/trigger', {
                    lat,
                    lng,
                    category
                });

                setStatus(`⚠️ ${category} SOS sent (no camera)`);
            }

        } catch (error) {
            console.error(error);
            setStatus("❌ Failed to send SOS");
        } finally {
            setLoading(false);
        }
    };

    const startPress = () => {
        if (loading) return;

        setIsPressing(true);
        timerRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timerRef.current);
                    triggerEmergency("General");
                    return 100;
                }
                return prev + 2;
            });
        }, 60);
    };

    const stopPress = () => {
        setIsPressing(false);
        clearInterval(timerRef.current);
        setProgress(0);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>

            <button
                disabled={loading}
                onMouseDown={startPress}
                onMouseUp={stopPress}
                onMouseLeave={stopPress}
                onTouchStart={startPress}
                onTouchEnd={stopPress}
                style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: loading
                        ? '#999'
                        : isPressing
                        ? '#c0392b'
                        : '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 40px rgba(255,0,0,0.6)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                {loading ? 'Sending...' : isPressing ? `${Math.round(progress)}%` : 'SOS'}
            </button>

            <p style={{ color: '#666', marginTop: '10px' }}>
                Hold for 3 seconds in an emergency
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                maxWidth: '300px',
                margin: '20px auto'
            }}>
                <button disabled={loading} onClick={() => triggerEmergency("Medical")}>🏥 Medical</button>
                <button disabled={loading} onClick={() => triggerEmergency("Fire")}>🔥 Fire</button>
                <button disabled={loading} onClick={() => triggerEmergency("Disaster")}>⚠️ Disaster</button>
                <button disabled={loading} onClick={() => triggerEmergency("Accident")}>🚗 Accident</button>
            </div>

            <p style={{ fontWeight: 'bold', marginTop: '10px' }}>{status}</p>

        </div>
    );
};

export default SOSButton;
