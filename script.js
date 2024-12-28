const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const leaderboardSection = document.querySelector(".leaderboard");

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const progressElement = document.getElementById("progress");
const timerElement = document.getElementById("timer");
const scoreDisplay = document.getElementById("score-display");
const leaderboardList = document.getElementById("leaderboard-list");

let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timer;
let timeLimit = 15;

// Show Landing Page
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
    leaderboardSection.style.display = "none";
}

// Show Category Selection
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
    leaderboardSection.style.display = "none";
}

// Show Quiz Section
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";
    leaderboardSection.style.display = "none";

    score = 0;
    currentQuestionIndex = 0;
    scoreDisplay.textContent = "";
    fetchQuestions(category);
}

// Fetch Questions
async function fetchQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=20&type=multiple&category=${category}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        questions = data.results;
        shuffleQuestions();
        displayQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Shuffle Questions and Options
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Display Question
function displayQuestion() {
    clearInterval(timer);
    startTimer();

    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("option");
        button.onclick = () => checkAnswer(answer === question.correct_answer);
        optionsContainer.appendChild(button);
    });

    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

// Start Timer
function startTimer() {
    let timeRemaining = timeLimit;
    timerElement.textContent = `Time: ${timeRemaining}s`;

    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            checkAnswer(false); // Treat as wrong answer
        }
    }, 1000);
}

// Check Answer
function checkAnswer(isCorrect) {
    clearInterval(timer);
    if (isCorrect) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    clearInterval(timer);
    questionElement.textContent = "Quiz Complete!";
    optionsContainer.innerHTML = "";
    scoreDisplay.textContent = `Your final score is ${score}`;
    saveToLeaderboard(score);
}

// Save and Display Leaderboard
function saveToLeaderboard(newScore) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b - a);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
    quizSection.style.display = "none";
    leaderboardSection.style.display = "";

    leaderboardList.innerHTML = leaderboard.slice(0, 5).map((score, index) =>
        `<p>${index + 1}. Score: ${score}</p>`
    ).join("");
}

// Initialize
showLandingPage();
