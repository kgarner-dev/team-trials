import React, { useState, useEffect } from "react";
import "./Quiz.scss";
import collegeTeams from '../assets/content/colleges.json';
import Card from "./Card";

function Quiz(props: any) {
    const [collegeList, setCollegeList] = useState<any[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [points, setPoints] = useState(100);
    const [totalPoints, setTotalPoints] = useState(0);
    const [quizVisible, setQuizVisible] = useState(true);
    const [resultVisible, setResultVisible] = useState(false);
    const [quizResultsArray, setQuizResultsArray] = useState<number[]>([]);

    const shuffleArray = (array: any[]) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const filteredColleges = collegeTeams.filter(team => team.conference === props.conference);
        setCollegeList(shuffleArray(filteredColleges));
    }, [props.conference]);

    useEffect(() => {
        if (attemptCount > 0 && attemptCount <= 3) {
            document.getElementById(`q${attemptCount}`)!.style.display = "inline-grid";
            document.getElementById(`q${attemptCount}`)!.style.opacity = "1";
            document.getElementById(`s${attemptCount}`)!.style.opacity = "1";
            document.getElementById(`s${attemptCount}`)!.style.color = "red";
            
            setPoints(prevPoints => prevPoints - 20);
        } else if (attemptCount == 4) {
            document.getElementById('q3')!.style.filter = "unset";
            document.getElementById(`s4`)!.style.opacity = "1";
            document.getElementById(`s4`)!.style.color = "red";

            setPoints(prevPoints => prevPoints - 20);
        } else if (attemptCount == 5) {
            document.getElementById(`s5`)!.style.opacity = "1";
            document.getElementById(`s5`)!.style.color = "red";

            setPoints(prevPoints => prevPoints - 20);
        }
    }, [attemptCount]);

    useEffect(() => {
        if (questionIndex === collegeList.length && collegeList.length > 0) {
            setQuizVisible(false);
            setResultVisible(true);
        }
    }, [questionIndex, collegeList.length, totalPoints]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const currentCollege = collegeList[questionIndex];
        if (!currentCollege) return;

        const formattedAnswer = userAnswer.trim().toLowerCase();
        const isCorrectAnswer = currentCollege.alternateNames.some(
            (name: string) => name.toLowerCase() === formattedAnswer
        ) || currentCollege.school.toLowerCase() === formattedAnswer;

        if (isCorrectAnswer) {
            setQuizResultsArray(prevResults => [...prevResults, attemptCount]);
            setAttemptCount(0);
            setTotalPoints(totalPoints => totalPoints + points)
            setPoints(100)

            for (let i = 1; i <= 5; i++) {
                const strike = document.getElementById(`s${i}`);
                if (strike) {
                    strike.style.opacity = "0.25";
                    strike.style.color = "black";
                }
            }

            for (let i = 1; i <= 3; i++) {
                const question = document.getElementById(`q${i}`);
                if (question) {
                    question.style.display = "none";
                    question.style.opacity = "0";
                }
            }

            const logo = document.getElementById(`q3`);
            logo!.style.filter = "brightness(0)";            
            
            if (questionIndex < collegeList.length - 1) {
                setQuestionIndex(prevIndex => prevIndex + 1);
            } else {
                setQuizVisible(false);
                setResultVisible(true);
            }
        } else {
            setAttemptCount(prevCount => prevCount + 1);
            
            if (attemptCount == 4) {
                setQuizResultsArray(prevResults => [...prevResults, attemptCount]);
                setAttemptCount(0);  
                setTotalPoints(totalPoints => totalPoints + 0)
                setPoints(100)

                for (let i = 1; i <= 5; i++) {
                    const strike = document.getElementById(`s${i}`);
                    if (strike) {
                        strike.style.opacity = "0.25";
                        strike.style.color = "black";
                    }
                }
    
                for (let i = 1; i <= 3; i++) {
                    const question = document.getElementById(`q${i}`);
                    if (question) {
                        question.style.display = "none";
                        question.style.opacity = "0";
                    }
                }
    
                const logo = document.getElementById(`q3`);
                logo!.style.filter = "brightness(0)";   

                if (questionIndex < collegeList.length - 1) {
                    setQuestionIndex(prevIndex => prevIndex + 1);
                } else {
                    setQuizVisible(false);
                    setResultVisible(true);
                }
            }
        }

        setUserAnswer("");
    };

    return (
        <div className="quiz-window" id="quiz-window">
        {quizVisible && (
            <>
            <div className="quiz-question">
                <div className="quiz-color quiz-color--primary" style={{ backgroundColor: collegeList[questionIndex]?.color }}>
                    <h2>Primary Color</h2>
                </div>
            </div>

            <div className="quiz-question">
                <div className="quiz-color quiz-color--secondary" id="q1" style={{ backgroundColor: collegeList[questionIndex]?.alternateColor }}>
                    <h2>Secondary Color</h2>
                </div>
            </div>

            <div className="quiz-question--2" id="q2">
                <p><span>Stadium</span> { collegeList[questionIndex]?.location.name }</p>
                <p><span>Conference</span> { collegeList[questionIndex]?.conference }</p>
                <p><span>Location</span> { collegeList[questionIndex]?.location.city }, { collegeList[questionIndex]?.location.state }</p>
            </div>

            <div className="quiz-question--logo" id="q3">
                <div className="quiz-logo" style={{ backgroundImage: `url(${ collegeList[questionIndex]?.logos[0] })` }}>
                </div>
            </div>

            <div className="quiz-details">
                <div className="guesses">
                    <p id="s1">X</p>
                    <p id="s2">X</p>
                    <p id="s3">X</p>
                    <p id="s4">X</p>
                    <p id="s5">X</p>
                </div>
                <div className="question-number">
                    <p>{ questionIndex + 1 } / { collegeList.length }</p>
                </div>
            </div>  
            </>
        )}

        {resultVisible && (
            <div className="result-window" id="result-window">
                <div className="results">
                    <p>Total Points: { totalPoints }</p>
                </div>
                {collegeList.map((college, index) => {
                    const missedQuestions = quizResultsArray[index] || 0;
                    const grayscalePercentage = Math.min(Math.max(missedQuestions * 20, 0), 100);

                    return (
                        <Card 
                            key={index} 
                            school={college.school} 
                            mascot={college.mascot} 
                            city={college.location.city} 
                            state={college.location.state} 
                            stadium={college.location.name} 
                            conference={college.conference} 
                            classification={college.classification} 
                            logo={college.logos[0]} 
                            color={college.color} 
                            grayscale={grayscalePercentage}
                        />
                    );
                })}
            </div>
        )}

        {quizVisible && (
             <form className="answer-window" id="answer-window" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="answer" 
                    name="answer" 
                    placeholder="Input answer here..." 
                    autoComplete="off"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                />
             <button type="submit">→</button>
            </form>
            )}
        </div>
    );
}

export default Quiz;