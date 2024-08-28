import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
        navigate("/login");
    }
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/quiz", {});
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect! The correct answer was ${currentQuestion.correctAnswer}.`);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setFeedback("");
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  if (isComplete) {
    return (
      <div>
        <h1>Quiz Complete!</h1>
        <p>Thanks for participating! Your score is {score} out of {questions.length}.</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Ice Cream Trivia Quiz</h1>
      <div>
        <h2>{currentQuestion.question}</h2>
        <ul>
          {currentQuestion.answers.map((answer, index) => (
            <li key={index}>
              <label>
                <input
                  type="radio"
                  value={answer}
                  checked={selectedAnswer === answer}
                  onChange={() => handleAnswer(answer)}
                />
                {answer}
              </label>
            </li>
          ))}
        </ul>
        {feedback && <p className={`feedback ${feedback.includes("Correct") ? "correct" : "incorrect"}`}>{feedback}</p>}
        <button onClick={handleNextQuestion} disabled={!selectedAnswer}>
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;