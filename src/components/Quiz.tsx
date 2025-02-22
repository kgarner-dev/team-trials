import React, { useState, useEffect } from "react";
import "./Quiz.scss";
import collegeTeams from '../assets/content/colleges.json';

function Quiz(props: any) {
    const [collegeList, setCollegeList] = useState<any[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);

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
        } else if (attemptCount == 4) {
            document.getElementById('q3')!.style.filter = "unset";
            document.getElementById(`s4`)!.style.opacity = "1";
            document.getElementById(`s4`)!.style.color = "red";
        }
    }, [attemptCount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const currentCollege = collegeList[questionIndex];
        if (!currentCollege) return;

        if (userAnswer.trim().toLowerCase() === currentCollege.school.toLowerCase()) {
            setAttemptCount(0);

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
                setUserAnswer("");
            } else {
                console.log("End of quiz");
            }
        } else {
            setAttemptCount(prevCount => prevCount + 1);
            
            if (attemptCount >= 5) {
                alert("GAME OVER!");
            }
        }

        setUserAnswer("");
    };

    return (
        <>
        <div className="quiz-window">
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
        </div>

            <form className="answer-window" onSubmit={handleSubmit}>
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
        </>
    );
}

export default Quiz;