
const questions = [
    {
        question: "What is JavaScript?",
        options: [
            "Programming language",
            "Database",
            "Operating system",
            "Web browser"
        ],
        answer: 0,
        explanation: "JavaScript is a programming language used to make websites interactive."
    },
    {
        question: "Which keyword declares a variable?",
        options: ["print", "let", "display", "show"],
        answer: 1,
        explanation: "The let keyword declares a block-scoped variable."
    },
    {
        question: "Which method prints something in the console?",
        options: ["console.log()", "console.print()", "print()", "show()"],
        answer: 0,
        explanation: "console.log() displays output in the browser console."
    },
    {
        question: "Which symbol is used for strict equality?",
        options: ["=", "==", "===", "!="],
        answer: 2,
        explanation: "=== checks both value and data type."
    },
    {
        question: "Which method adds an item to an array?",
        options: ["remove()", "push()", "delete()", "pop()"],
        answer: 1,
        explanation: "push() adds an item to the end of an array."
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let answered = false;
let wrongAnswers = [];



function showQuestion() {

    clearInterval(timer);

    answered = false;
    timeLeft = 30;

    const q = questions[currentQuestion];

    document.getElementById("progress").textContent =
        `Question ${currentQuestion + 1}/${questions.length}`;

    document.getElementById("score").textContent =
        `Score: ${score}`;

    document.getElementById("progress-fill").style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    document.getElementById("timer").textContent = timeLeft;

    document.getElementById("question").textContent =
        q.question;

    document.getElementById("explanation").textContent = "";

    document.getElementById("next-btn").disabled = true;

    const optionsContainer =
        document.getElementById("options");

    optionsContainer.innerHTML = "";

    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.textContent = option;
        button.className = "option";

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        optionsContainer.appendChild(button);

    });

    startTimer();
}



function checkAnswer(selectedIndex) {

    if (answered) return;

    answered = true;
    clearInterval(timer);

    const q = questions[currentQuestion];

    const buttons = document.querySelectorAll(".option");

    buttons.forEach((button, index) => {

        button.disabled = true;

        if (index === q.answer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && selectedIndex !== q.answer) {
            button.classList.add("wrong");
        }

    });

    if (selectedIndex === q.answer) {

        score++;

        document.getElementById("score").textContent =
            `Score: ${score}`;

    } else {

        wrongAnswers.push({
            question: q.question,
            selected: q.options[selectedIndex],
            correct: q.options[q.answer],
            explanation: q.explanation
        });

    }

    document.getElementById("explanation").textContent =
        q.explanation;

    document.getElementById("next-btn").disabled = false;
}



function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("timer").textContent =
            timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            if (!answered) {

                wrongAnswers.push({
                    question: questions[currentQuestion].question,
                    selected: "No answer (Time out)",
                    correct: questions[currentQuestion].options[
                        questions[currentQuestion].answer
                    ],
                    explanation: questions[currentQuestion].explanation
                });

                checkAnswer(-1);
            }
        }

    }, 1000);
}



document.getElementById("next-btn").addEventListener("click", () => {

    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        showResult();

    }

});



function showResult() {

    clearInterval(timer);

    document.getElementById("question").textContent =
        "Quiz Completed!";

    document.getElementById("options").innerHTML = "";

    document.getElementById("timer").textContent = "";

    document.getElementById("explanation").textContent = "";

    document.getElementById("next-btn").style.display = "none";

    const percentage = (score / questions.length) * 100;

    let rating;

    if (percentage >= 80) {
        rating = "Excellent! Amazing work!";
    } else if (percentage >= 60) {
        rating = "Good job! Keep practising.";
    } else if (percentage >= 40) {
        rating = "Not bad! You can improve.";
    } else {
        rating = "Keep learning. Try again!";
    }

    document.getElementById("result").innerHTML = `
        <h2>Your Final Score: ${score}/${questions.length}</h2>
        <h3>${percentage}%</h3>
        <p>${rating}</p>

        <button onclick="reviewAnswers()">
            Review Wrong Answers
        </button>

        <button onclick="restartQuiz()">
            Restart Quiz
        </button>
    `;
}


function reviewAnswers() {

    const result = document.getElementById("result");

    let html = "<h2>Review Wrong Answers</h2>";

    if (wrongAnswers.length === 0) {
        html += "<p>Perfect! You made no mistakes.</p>";
    }

    wrongAnswers.forEach((item, index) => {

        html += `
            <div class="review-item">
                <h3>${index + 1}. ${item.question}</h3>
                <p>Your answer: ${item.selected}</p>
                <p>Correct answer: ${item.correct}</p>
                <p>Explanation: ${item.explanation}</p>
            </div>
        `;

    });

    html += `
        <button onclick="showResult()">Back to Results</button>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;

    result.innerHTML = html;
}



function restartQuiz() {

    clearInterval(timer);

    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    answered = false;
    wrongAnswers = [];

    document.getElementById("next-btn").style.display = "block";
    document.getElementById("result").innerHTML = "";

    showQuestion();
}

// Start the quiz
showQuestion();
