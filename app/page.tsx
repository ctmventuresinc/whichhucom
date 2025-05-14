"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  detectAndCropFace,
  loadFaceDetectionModels,
  CropMode,
} from "../utils/faceDetection";

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

// Round configurations
const ROUNDS = [
  {
    id: 1,
    name: "Round 1",
    description: "Get 5 correct guesses in 60 seconds to advance",
    timeLimit: 60,
    targetScore: 5,
    cropMode: "normal" as CropMode,
  },
  {
    id: 2,
    name: "Round 2",
    description: "Now it gets harder! 5 correct in 30 seconds",
    timeLimit: 30,
    targetScore: 5,
    cropMode: "tight" as CropMode,
  },
  {
    id: 3,
    name: "Final Round",
    description: "Expert level! 5 correct in 20 seconds",
    timeLimit: 20,
    targetScore: 5,
    cropMode: "eyes-only" as CropMode,
  },
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

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0); // 0 = not started
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showGameSummary, setShowGameSummary] = useState(false);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load face detection models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await loadFaceDetectionModels();
        setModelsLoading(false);
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setModelsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameStarted && remainingTime > 0 && !showResult) {
      timerRef.current = setTimeout(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            // Time's up for this round
            endRound();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameStarted, remainingTime, showResult]);

  // Load new image when round changes or after guess
  useEffect(() => {
    if (gameStarted && currentRound > 0 && !showResult) {
      loadNewImage();
    }
  }, [currentRound, showResult]);

  const loadNewImage = () => {
    const randomImage = getRandomImage();
    setCurrent(randomImage);
    setCroppedImageSrc(null);

    if (randomImage) {
      const cropMode = ROUNDS[currentRound - 1].cropMode;
      processImage(randomImage.src, cropMode);
    }
  };

  // Process image for face detection with appropriate crop mode
  const processImage = async (imageSrc: string, cropMode: CropMode) => {
    try {
      // Get the full URL including the domain
      const fullImageUrl = window.location.origin + imageSrc;

      // Detect and crop the face with the specified crop mode
      const croppedImage = await detectAndCropFace(fullImageUrl, cropMode);
      setCroppedImageSrc(croppedImage);
    } catch (error) {
      console.error("Error processing image:", error);
      setCroppedImageSrc(null);
    }
  };

  const handleGuess = (guess: string) => {
    setGuessed(guess);
    setShowResult(true);

    // Update score and streak
    if (guess === current?.school) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Check if timer should be stopped
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Automatic continue after 1.5 seconds
    setTimeout(() => {
      if (
        guess === current?.school &&
        streak + 1 >= ROUNDS[currentRound - 1].targetScore
      ) {
        // Met target score, advance to next round or end game
        if (currentRound < ROUNDS.length) {
          advanceToNextRound();
        } else {
          endGame(true); // Win
        }
      } else if (remainingTime <= 0) {
        endRound();
      } else {
        // Continue with next image
        setShowResult(false);
        loadNewImage();
      }
    }, 1500);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setScore(0);
    setStreak(0);
    setRemainingTime(ROUNDS[0].timeLimit);
    setGameOver(false);
    setShowGameSummary(false);
  };

  const advanceToNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setStreak(0);
    setRemainingTime(ROUNDS[currentRound].timeLimit);
    setShowResult(false);
  };

  const endRound = () => {
    // Check if player met target score
    if (streak >= ROUNDS[currentRound - 1].targetScore) {
      if (currentRound < ROUNDS.length) {
        advanceToNextRound();
      } else {
        endGame(true); // Win
      }
    } else {
      endGame(false); // Did not reach target score
    }
  };

  const endGame = (isWin: boolean) => {
    setGameOver(true);
    setShowGameSummary(true);
    setGameStarted(false);
    // Final message depends on how far they got
    if (isWin && currentRound === ROUNDS.length) {
      // They beat all rounds
    } else if (currentRound > 1) {
      // They made it past at least one round
    } else {
      // They didn't make it past round 1
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setShowGameSummary(false);
    setGameOver(false);
  };

  // Render welcome screen if game not started
  if (!gameStarted && !gameOver) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f7f7fa",
          padding: "0 16px",
        }}
      >
        <h1 style={{ marginBottom: 32, textAlign: "center" }}>
          Hampton or Howard?
        </h1>
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            marginBottom: 24,
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <h2 style={{ marginBottom: 16, textAlign: "center" }}>
            The Ultimate HBCU Challenge
          </h2>
          <p style={{ marginBottom: 24, lineHeight: 1.5 }}>
            Can you tell the difference between Hampton and Howard students? It
            might be harder than you think!
          </p>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Game Rules:</h3>
            <ul style={{ paddingLeft: 24, lineHeight: 1.5 }}>
              {ROUNDS.map((round) => (
                <li key={round.id} style={{ marginBottom: 8 }}>
                  <strong>{round.name}:</strong> {round.description}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={startGame}
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
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Game summary screen
  if (showGameSummary) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f7f7fa",
          padding: "0 16px",
        }}
      >
        <h1 style={{ marginBottom: 32, textAlign: "center" }}>Game Over</h1>
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            marginBottom: 24,
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <h2 style={{ marginBottom: 16, textAlign: "center" }}>
            {currentRound === ROUNDS.length + 1
              ? "You Won! 🏆"
              : `You Made it to Round ${currentRound}`}
          </h2>

          <p style={{ marginBottom: 24, textAlign: "center", fontSize: 18 }}>
            Total Score: <strong>{score}</strong>
          </p>

          <button
            onClick={restartGame}
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
        </div>
      </div>
    );
  }

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "340px",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: "bold" }}>Round {currentRound}</div>
        <div>
          Score: {streak}/{ROUNDS[currentRound - 1].targetScore}
        </div>
        <div>Time: {remainingTime}s</div>
      </div>

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
            <div style={{ textAlign: "center" }}>
              Loading face detection models...
            </div>
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
                <div
                  style={{
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
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color:
                        guessed === current?.school ? "#22c55e" : "#ef4444",
                      textAlign: "center",
                      padding: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 8,
                      maxWidth: "80%",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #3498db",
                    borderRadius: "50%",
                    margin: "0 auto 10px",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <style jsx>{`
                  @keyframes spin {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
                Processing image...
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, width: "340px" }}>
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
                flex: 1,
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
                flex: 1,
              }}
            >
              Howard
            </button>
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            Loading next image...
          </div>
        )}
      </div>
    </div>
  );
}
