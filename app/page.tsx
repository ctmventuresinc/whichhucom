"use client";

import React, { useState, useEffect } from "react";
import { detectAndCropFace, loadFaceDetectionModels } from "../utils/faceDetection";

const hamptonImages = [
  "Andrew_Creary.jpeg",
  "Carlo_Turavani.jpeg",
  "Carson_Byrd.jpeg",
  "Charles_Robinson.jpeg",
  "Charles_Young.jpeg",
  "Darius_Johnson.jpeg",
  "Dennis_Conley.jpeg",
  "Dennis_Mathis.jpeg",
  "Franklin_Frazier.jpeg",
  "Herbert_Bynes.jpeg",
  "Jacobi_Fenner.jpeg",
  "James_Butts.jpeg",
  "Jeremy_Gilchrist.jpeg",
  "Jerry_Cummings.jpeg",
  "Jobie_Dowling.jpeg",
  "Jonathan_Wade.jpeg",
  "Kevin_Teel.jpeg",
  "Kyle_Lloyd.jpeg",
  "Michael_Swett.jpeg",
  "Namon_Freeman.jpeg",
  "Rasoul_Wilson.jpeg",
  "Reggie_Dixon.jpeg",
  "Ryan_Cave.jpeg",
  "Tobin_Lyon.jpeg",
  "Wakeem_Goode.jpeg",
];
const howardImages = [
  "Aiyegoro_Richard.JPG",
  "Alkins_Chris.JPG",
  "Allen_Wright_Deonta.JPG",
  "Alston_Cameron.JPG",
  "Anglin_Elijah.JPG",
  "Antoine_Tamlin.JPG",
  "Banks_Yoseff.JPG",
  "Bennett_Jacob.JPG",
  "Blair_Julian.JPG",
  "Boozer_Tommie.JPG",
  "Boyd_Toree.JPG",
  "Branton_Casey.JPG",
  "Brown_Khari.JPG",
  "Brown_Tavius.JPG",
  "Brown_Travis.JPG",
  "Chaney_Justin.JPG",
  "Colvin_Matthew.JPG",
  "Cunningham_Jamie.JPG",
  "David_Julien.JPG",
  "Day_Jalen.JPG",
  "Dillard_Joseph.JPG",
  "Dunham_Jordan.JPG",
  "Dunn_Alonte.JPG",
  "Ezell_Jabril.JPG",
  "Fleck_John.JPG",
  "Freeman_Aquanius.JPG",
  "Gresham_Chisolm_Damon.JPG",
  "Grimes_Odis.JPG",
  "Hall_Raymond.JPG",
  "Harris_Marvin.JPG",
  "Hartman_Stewart.JPG",
  "Haugabook_Trae.JPG",
  "Hogan_Lance.JPG",
  "Holman_James.JPG",
  "Hunt_Travon.JPG",
  "Iduwe_Ghanfona.JPG",
  "Iyere_Patrick.JPG",
  "Johnson_Craig.JPG",
  "Johnson_Da_Vaun.JPG",
  "Johnson_Kalen.JPG",
  "Johnson_Richard.JPG",
  "Kebe_Ibrahima.JPG",
  "Kendricks_Shaka.JPG",
  "Kindle_Parrish_Caleb.JPG",
  "Lassiter_LeLand.JPG",
  "Lebofsky_Dakota.JPG",
  "Lee_David.JPG",
  "Lewis_Nathan.JPG",
  "MB.png",
  "Matthews_Atavius.JPG",
  "McGhee_Greg.JPG",
  "Mercer_Robert.JPG",
  "Mills_Zachary.JPG",
  "Offor_Godspower.JPG",
  "Orr_Austin.JPG",
  "Parker_Matthew.JPG",
  "Parker_William.JPG",
  "Payne_Andre.JPG",
  "Pittman_Eric.JPG",
  "Powers_Gregory.JPG",
  "Price_DeAndre.JPG",
  "Reid_Devyn.JPG",
  "Reyes_Janer.JPG",
  "Robinson_Alizah.JPG",
  "Robinson_Charles.JPG",
  "Rollins_Devin.JPG",
  "Russ_Kenneth.JPG",
  "Rutledge_Malcolm.JPG",
  "Shadrach_Tyler.JPG",
  "Smith_John.JPG",
  "Stevens_Julio.JPG",
  "Thiel_David.JPG",
  "Tusan_Terrance.JPG",
  "Tyson_Rodney.JPG",
  "Warren_Howard.JPG",
  "Williams_Cody.JPG",
  "Williams_Myles.JPG",
  "Wright_Gerald.JPG",
];

function getRandomImage() {
  const isHampton = Math.random() < 0.5;
  if (isHampton) {
    const idx = Math.floor(Math.random() * hamptonImages.length);
    return {
      src: `/hampton images/${hamptonImages[idx]}`,
      school: "Hampton",
    };
  } else {
    const idx = Math.floor(Math.random() * howardImages.length);
    return {
      src: `/low quality images for howard/${howardImages[idx]}`,
      school: "Howard",
    };
  }
}

export default function Page() {
  const [current, setCurrent] = useState<{
    src: string;
    school: string;
  } | null>(null);
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);
  const [guessed, setGuessed] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);

  // Load face detection models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceDetectionModels();
        setModelsLoading(false);
      } catch (error) {
        console.error('Error loading face detection models:', error);
        setModelsLoading(false);
      }
    };
    
    loadModels();
  }, []);

  // On mount, pick the first image (fixes hydration error)
  useEffect(() => {
    const randomImage = getRandomImage();
    setCurrent(randomImage);
    
    // Process the image for face detection once models are loaded
    if (!modelsLoading && randomImage) {
      processImage(randomImage.src);
    }
  }, [modelsLoading]);
  
  // Process image for face detection
  const processImage = async (imageSrc: string) => {
    try {
      // Get the full URL including the domain
      const fullImageUrl = window.location.origin + imageSrc;
      
      // Detect and crop the face
      const croppedImage = await detectAndCropFace(fullImageUrl);
      setCroppedImageSrc(croppedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      setCroppedImageSrc(null);
    }
  };

  const handleGuess = (guess: string) => {
    setGuessed(guess);
    setShowResult(true);
  };

  const handlePlayAgain = () => {
    const randomImage = getRandomImage();
    setCurrent(randomImage);
    setCroppedImageSrc(null);
    setGuessed(null);
    setShowResult(false);
    
    // Process the new image
    if (randomImage) {
      processImage(randomImage.src);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f7f7fa",
      }}
    >
      <h1 style={{ marginBottom: 32 }}>Hampton or Howard?</h1>
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 340,
            height: 440,
            background: "#e5e7eb",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            position: "relative",
          }}
        >
          {modelsLoading ? (
            <div style={{ textAlign: "center" }}>Loading face detection models...</div>
          ) : croppedImageSrc ? (
            <>
              <img
                src={croppedImageSrc}
                alt="Guess who?"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                  display: "block",
                }}
              />
              {showResult && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 8,
                  zIndex: 10
                }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: guessed === current?.school ? "#22c55e" : "#ef4444",
                      textAlign: "center",
                      padding: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 8,
                      maxWidth: "80%"
                    }}
                  >
                    {guessed === current?.school
                      ? "Correct! 🎉"
                      : `Wrong! It's ${current?.school} 😢`}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              height: "100%"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  border: "4px solid #f3f3f3", 
                  borderTop: "4px solid #3498db", 
                  borderRadius: "50%",
                  margin: "0 auto 10px",
                  animation: "spin 1s linear infinite"
                }}></div>
                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                Processing image...
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        {!showResult ? (
          <>
            <button
              onClick={() => handleGuess("Hampton")}
              style={{
                background: "#1a365d",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                width: "50%",
              }}
            >
              Hampton
            </button>
            <button
              onClick={() => handleGuess("Howard")}
              style={{
                background: "#ba0c2f",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                width: "50%",
              }}
            >
              Howard
            </button>
          </>
        ) : (
          <button
            onClick={handlePlayAgain}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
