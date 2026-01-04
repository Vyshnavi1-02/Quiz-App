import React, { useEffect, useState } from "react";
import questions from "./questions";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // ---------------- STATE ----------------
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizEnd, setQuizEnd] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // ---------------- SHUFFLE OPTIONS ----------------
  useEffect(() => {
    const shuffled = [...questions[currentQuestion].options].sort(
      () => Math.random() - 0.5
    );
    setShuffledOptions(shuffled);
    setSelectedOption("");
    setTimeLeft(30);
  }, [currentQuestion]);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (quizEnd) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizEnd]);

  // ---------------- NEXT ----------------
  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizEnd(true);
    }
  };

  // ---------------- RESTART ----------------
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizEnd(false);
    setTimeLeft(30);
  };

  // ---------------- RESULT SCREEN ----------------
  if (quizEnd) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card p-5 shadow-lg rounded-4 text-center" style={{ width: "600px" }}>
          <h2 className="mb-3">🎉 Quiz Completed</h2>
          <h4 className="text-success mb-4">
            Score: {score} / {questions.length}
          </h4>
          <button className="btn btn-primary px-4" onClick={handleRestart}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // ---------------- QUIZ UI ----------------
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-5 shadow-lg rounded-4"
        style={{ width: "650px", minHeight: "500px" }}
      >
        {/* Progress Bar */}
        <div className="progress mb-4" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            Question {currentQuestion + 1} / {questions.length}
          </h5>
          <span className="badge bg-danger fs-6 px-3 py-2">
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Question */}
        <h4 className="mb-4">
          {questions[currentQuestion].question}
        </h4>

        {/* Options (Fixed height to avoid movement) */}
        <div className="list-group mb-4" style={{ minHeight: "220px" }}>
          {shuffledOptions.map((option, index) => (
            <label
              key={index}
              className={`list-group-item list-group-item-action ${
                selectedOption === option ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="option"
                className="form-check-input me-2"
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
              />
              {option}
            </label>
          ))}
        </div>

        {/* Button */}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-success px-4"
            onClick={handleNext}
            disabled={!selectedOption}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
