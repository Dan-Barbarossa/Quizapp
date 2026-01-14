import React, { useEffect, useState } from 'react'
import he from "he";

const URL = 'https://opentdb.com/api.php?amount=10&type=multiple'

const QuizCard = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0)

    useEffect(() => {
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                const normalized = data.results.map((q) => ({
                    ...q,
                    question: he.decode(q.question),
                    correct_answer: he.decode(q.correct_answer),
                    incorrect_answers: q.incorrect_answers.map(he.decode),
                }));

                setQuestions(normalized);
                console.log(normalized); // ✅ OK to log
            });
    }, []);

    const handleAnswerClick = (answer) => {
        const correct = questions[currentQuestionIndex].correct_answer;
        if (he.decode(answer) === he.decode(correct)) {
            setScore((s) => s + 1);
        }
        setCurrentQuestionIndex((i) => i + 1);
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
    }
    if (questions.length === 0) {
        return <div>Loading...</div>
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 bg-black text-white p-3 w-[500px] h-[200px] rounded-xl'>
                <h1 className='font-bold'>Quiz Completed</h1>
                <p className='text-2xl'>Your Score: {score}/{questions.length}</p>
                <button
                    className='bg-white text-black text-2xl p-2 hover:bg-gray-500 hover:text-white w-[200px] rounded-xl'
                    onClick={restartQuiz}>
                    Restart Quiz
                </button>
            </div>)
    }

    const currentQuestion = questions[currentQuestionIndex]

    const shuffle = [...currentQuestion.incorrect_answers]
    const correct_ans_index = Math.floor(Math.random() * 4);
    shuffle.splice(correct_ans_index, 0, currentQuestion.correct_answer)


    return (
        <div className='bg-black text-white p-3 w-[500px] h-[350px] rounded-xl'>
            <h2 className='font-bold'>Question {currentQuestionIndex + 1}</h2>
            <p className=' text-xl h-[80px]'>{he.decode(currentQuestion.question)}</p>
            <ul className='mt-4 flex flex-col items-center gap-4'>
                {shuffle.map((ans) => (
                    <li
                        className='bg-white text-black pl-2 pr-2 text-xl w-[300px] flex flex-col items-center pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gray-500 hover:text-white'
                        key={ans} onClick={() => handleAnswerClick(ans)}>
                        {he.decode(ans)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default QuizCard
