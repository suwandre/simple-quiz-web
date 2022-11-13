import { getQuiz } from "../utils/getQuiz";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { CenteredDiv } from "../components/Div/CustomDivs";

const Quiz = ({ quizDatas }) => {
    const router = useRouter();
    const { isAuthenticated, user } = useMoralis();

    const [timerSeconds, setTimerSeconds] = useState(0);
    const [clickedStart, setClickedStart] = useState(false);
    const [questionId, setQuestionId] = useState(1);
    // gets updated whenever the user clicks on a checkbox.
    const [temporaryChosenAnswers, setTemporaryChosenAnswers] = useState([]);
    const [chosenAnswers, setChosenAnswers] = useState([]);
    // gets updated whenever the user clicks on a checkbox. only temporary, the final points will get added to `points`.
    const [temporaryPoints, setTemporaryPoints] = useState(0);
    // the amount of points the user has gotten so far
    const [points, setPoints] = useState(0);
    // the amount of total points the user could've gotten if answered instantly so far
    const [totalPoints, setTotalPoints] = useState(0);
    // gets updated whenever the user clicks on a correct checkbox. only temporary, the final correct choices will get added to `correctChoices`.
    const [temporaryCorrectChoices, setTemporaryCorrectChoices] = useState(0);
    // the user's correct choices
    const [correctChoices, setCorrectChoices] = useState(0);
    // gets updated whenever the user clicks on a wrong checkbox. only temporary, the final wrong choices will get added to `wrongChoices`.
    const [temporaryWrongChoices, setTemporaryWrongChoices] = useState(0);
    const [wrongChoices, setWrongChoices] = useState(0);
    // the amount of correct choices available so far for the quiz (depends on the question's `correctAnswers`)
    const [totalCorrectChoices, setTotalCorrectChoices] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [removeButton, setRemoveButton] = useState(false);

    const startQuiz = () => {
        setClickedStart(true);
        setTimerSeconds(quizDatas[questionId - 1].duration);
    }

    const nextQuestion = () => {
        if (questionId <= quizDatas.length) {
            finalizeCurrentQuestion();
            setQuestionId(questionId + 1);
            setTemporaryChosenAnswers([]);
            setTemporaryPoints(0);
            setTemporaryCorrectChoices(0);
            setTemporaryWrongChoices(0);
            setTimerSeconds(quizDatas[questionId].duration);
        }
    }

    useEffect(() => {
        let timerId;
        
        timerId = setInterval(() => {
            setTimerSeconds((timerSeconds) => timerSeconds - 1);
        }, 1000);
    
        return () => {
            console.log(`Clearing ${timerId}`);
            clearInterval(timerId);
        }
    }, [questionId]);

    const handleCheckboxChange = async (e) => {
        // get the time used (in seconds)
        const duration = quizDatas[questionId - 1].duration;
        const timeUsed = (duration - timerSeconds);
        // calculate points earned (linear decrease depending on time used)
        const maxPoints = quizDatas[questionId - 1].maximumPoints;
        const minPoints = quizDatas[questionId - 1].minimumPoints;
        const points = maxPoints - ((maxPoints - minPoints) / duration * timeUsed)

        // if there are more than 1 correct answers, the logic is different for point deduction.
        const availableAnswers = quizDatas[questionId - 1].answers.length;
        const correctAnswers = quizDatas[questionId - 1].correctAnswers.length;
        const isCorrect = quizDatas[questionId - 1].correctAnswers.includes(e.target.id);

        if (e.target.checked) {
           // check if the choice is correct
            if (isCorrect) {
                setTemporaryPoints(prevPoints => prevPoints + points);
                setTemporaryCorrectChoices(temporaryCorrectChoices + 1);
           } else {
                setTemporaryChosenAnswers(answers => answers.filter(answer => answer !== e.target.id));
                // if the answer is wrong, we check first the amount of answers available.
                // if there is only 1 answer available:
                if (availableAnswers === 1) {
                    // remove 1000 points
                    setTemporaryPoints(prevPoints => prevPoints - 1000);
                    setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices + 1);
                // if there is more than 1 answer available:
                } else {
                    // if the amount of correct answers are less than half of the available ones, remove only 1000 points.
                    if (correctAnswers < (availableAnswers / 2)) {
                        setTemporaryPoints(prevPoints => prevPoints - 1000);
                        setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices + 1);
                    // if the amount of correct answers are more than or equal to half of the available ones,
                    // we remove 2000 points.
                    } else {
                        setTemporaryPoints(prevPoints => prevPoints - 2000);
                        setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices + 1);
                    }
                }
            }
            setTemporaryChosenAnswers([...temporaryChosenAnswers, e.target.id]);
        // if the user decides to uncheck the box, this logic will run
        } else {
            // if the user removed a correct answer, we remove the points.
            // IMPORTANT: THIS LOGIC SHOULD ASSUME THAT THE LOGIC ABOVE (WHEN CHECKED) WAS RUN BEFORE, OR ELSE IT CAN CAUSE ISSUES!
            if (isCorrect) {
                setTemporaryPoints(prevPoints => prevPoints - points);
                setTemporaryCorrectChoices(temporaryCorrectChoices - 1);
            // if the choice was wrong, we check first the amount of answers available.
            } else {
                if (availableAnswers === 1) {
                    setTemporaryPoints(prevPoints => prevPoints + 1000);
                    setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices - 1);
                } else {
                    if (correctAnswers < (availableAnswers / 2)) {
                        setTemporaryPoints(prevPoints => prevPoints + 1000);
                        setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices - 1);
                    } else {
                        setTemporaryPoints(prevPoints => prevPoints + 2000);
                        setTemporaryWrongChoices(prevWrongChoices => prevWrongChoices - 1);
                    }
                }
            }
            setTemporaryChosenAnswers([...temporaryChosenAnswers.filter((answer) => answer !== e.target.id)]);
        }
    }

    // gets called when the question ends. this will add all temporary stats to the `final` stats.
    const finalizeCurrentQuestion = () => {
        setPoints(prevPoints => prevPoints + temporaryPoints);
        setChosenAnswers([...chosenAnswers, ...temporaryChosenAnswers]);
        setTotalPoints(prevTotalPoints => prevTotalPoints + (quizDatas[questionId - 1].maximumPoints * quizDatas[questionId - 1].correctAnswers.length));
        setCorrectChoices(prevCorrectChoices => prevCorrectChoices + temporaryCorrectChoices);
        setWrongChoices(prevWrongChoices => prevWrongChoices + temporaryWrongChoices);
        setTotalCorrectChoices(prevTotalCorrectChoices => prevTotalCorrectChoices + quizDatas[questionId - 1].correctAnswers.length);
    }

    const finalizeQuiz = () => setQuizEnded(true);

    const CurrentQuestion = () => {
        if (!quizEnded) {
            return (
                <div>
                    <h2>{questionId}. {quizDatas[questionId-1].question}</h2>
                    <Form>
                        <h5>Duration: {quizDatas[questionId-1].duration} seconds</h5>
                        <h5>Points obtainable: {quizDatas[questionId-1].minimumPoints} - {quizDatas[questionId-1].maximumPoints}</h5>
                        {timerSeconds > 0 ? <h5>Time left: {timerSeconds} seconds</h5> : questionId < quizDatas.length ? nextQuestion() : <h5>Time&apos`s up</h5>}
                        {quizDatas[questionId - 1].answers.map((answer) => (
                            <div key={answer} className='mb-3'>
                                <Form.Check type='checkbox' 
                                    id={answer} 
                                    label={answer} 
                                    onChange={(e) => handleCheckboxChange(e)}
                                    checked={temporaryChosenAnswers.lastIndexOf(answer) >= 0 ? true : false}
                                />
                            </div>
                        ))}
                    </Form>
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Quiz Ended</h2>
                </div>
            )
        }
    }

    const CurrentStatistics = () => {
        return (
            <div>
                <h2>Current statistics</h2>
                <p>You currently have {points}/{totalPoints} points.</p>
                <p>You have chosen {correctChoices}/{correctChoices + wrongChoices} correct choices.</p>
            </div>
        )
    }

    const FinalStatistics = () => {
        return (
            <div>
                <h2>Your final statistics</h2>
                <p>You have {points}/{totalPoints} points.</p>
                <p>You have chosen {correctChoices}/{correctChoices + wrongChoices} correct choices.</p>
            </div>
        )
    }

    if (!isAuthenticated) {
        return () => router.replace('/');
    } else {
        if (!clickedStart) {
            return (
                <div className='px-3 mt-5'>
                    <CenteredDiv>
                        <h5>Click the button below to start the quiz.</h5>
                        <Button variant='dark' onClick={() => {
                            startQuiz();
                        }}>Click here to get started.</Button>
                    </CenteredDiv>
                </div>
            )
        } else {
            return (
                <div>
                    <CurrentQuestion />
                    {!removeButton 
                        ? questionId !== quizDatas.length 
                            ? <Button variant='dark' onClick={nextQuestion}>Submit answer(s)</Button>
                            : <Button variant='dark' onClick={() => {finalizeQuiz(); setRemoveButton(true);}}>End quiz.</Button> 
                        : <h2>Thanks for playing!</h2>
                    }
                    {!quizEnded ? <CurrentStatistics /> : <FinalStatistics />}
                </div>
            )
        }
    }
}

export const getStaticProps = async () => {
    const quizDatas = await getQuiz();
    return {
        props: {
            quizDatas
        }
    }
}

export default Quiz;