import React from "react";
import Start from "./Start";
import { nanoid } from "nanoid";
import { shuffle, decodeHtml } from "../utils";
export default function Question(){
     // this state decide whether quiz shuld be rendered or not
  const [status, setStatus] = React.useState(false);
  // this state is used to get and set question
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  // this state decide whether a new game started or not
  const [newGame, setNewGame] = React.useState(false);
  // check for gameover
  const [gameOver, setGameOver] = React.useState(false);
  // track the score
  const [score, setScore] = React.useState(0);
  // getting questions from api
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => setQuizQuestions(generateQuiz(data.results)));
  }, [newGame]);

  function toggleStatus() {
    setStatus((oldStatus) => !oldStatus);
  }

  function generateQuiz(apiData) {
    const quizQuestion = apiData.map((quiz) => {
      return {
        id: nanoid(),
        question: decodeHtml(quiz.question),
        answers: shuffle(generateAnswer(quiz)),
      };
    });
    return quizQuestion;
  }

  function generateAnswer(dataFromApi) {
    const incorrectAnswers = dataFromApi.incorrect_answers;
    const correctAnswer = dataFromApi.correct_answer;
    const answers = incorrectAnswers.map((incorrectAnswer) => {
      return {
        id: nanoid(),
        value: incorrectAnswer,
        isCorrect: false,
        isChecked: false,
      };
    });
    answers.push({
      id: nanoid(),
      value: correctAnswer,
      isCorrect: true,
      isChecked: false,
    });
    return answers;
  }

  function AnswerOptions(props) {
    const styleBeforeGameOver = props.isChecked ? "#D6DBF5" : "";

    function styleGameOver() {
      if (props.isCorrect) {
        return "#94D7A2";
      } else if (props.isChecked && !props.isCorrect) {
        return "#F8BCBC";
      }
    }

    return (
      <div
        onClick={props.handleAnswerCheck}
        id={props.id}
        style={{
          backgroundColor: props.gameOver
            ? styleGameOver()
            : styleBeforeGameOver,
            borderColor:props.gameOver
            ? styleGameOver()
            : styleBeforeGameOver ,
        }}
        className="answer"
      >
        {props.value}
      </div>
    );
  }

  function handleAnswerCheck(questionId, answerId) {
   !gameOver? setQuizQuestions((oldQuizQuestions) =>
      oldQuizQuestions.map((oldQuizQuestion) => {
        return oldQuizQuestion.id === questionId
          ? {
              ...oldQuizQuestion,
              answers: oldQuizQuestion.answers.map((answer) => {
                return answer.id === answerId
                  ? {
                      ...answer,
                      isChecked: !answer.isChecked,
                    }
                  : { ...answer, isChecked: false };
              }),
            }
          : oldQuizQuestion;
      })
    ):(setQuizQuestions(prevquestion=>prevquestion))
  }

  function checkAnswers() {
    setGameOver(true);
    const answerTracker = quizQuestions.map((quizQuestion) => {
      const answer = quizQuestion.answers;
      return answer.some((answer) => answer.isChecked && answer.isCorrect);
    });
    let count = 0;
    answerTracker.forEach((answerBlock) =>
      answerBlock ? (count = count + 1) : count
    );
    setScore(count);
  }

  function handleClick() {
    !gameOver ? checkAnswers() : playAgain();
  }

  function playAgain() {
    setNewGame((newGame) => !newGame);
    setGameOver((prevGameOver) => !prevGameOver);
  }

  const Questions = quizQuestions.map((question) => {
    return (
      <div className="card" key={nanoid()}>
        <h3 className="question" key={question.id}>{question.question}</h3>
        <div className="answer-container">
          {question.answers.map((answer) => {
            return (
              <AnswerOptions
                key={answer.id}
                id={answer.id}
                value={decodeHtml(answer.value)}
                isCorrect={answer.isCorrect}
                isChecked={answer.isChecked}
                handleAnswerCheck={() =>
                  handleAnswerCheck(question.id, answer.id)
                }
                gameOver={gameOver}
              />
            );
          })}
        </div>
        <hr className="line"/>
      </div>
    );
  });

//   console.log(quizQuestions);
//   console.log(Questions);

  return (
    <>
      {!status ? (
        <Start handler={toggleStatus} />
      ) : (
        <div className="quiz">
          <div className="quiz-container">
            {Questions}
           <div className="bottom-container"> {gameOver ? (
              <h2 className="score-msg">you got {score}/5 correct!</h2>
                ) :("")}
              <div className="button-container">
                <button className="btn" onClick={handleClick}>
                  {!gameOver ? "Check Answer" : "Play Again"}
                </button>
              </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
}