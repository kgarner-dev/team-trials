import React, { useState, useEffect } from "react";
import "./Quiz.scss";
import Card from "./Card";

/* Import Team JSON */
import collegeTeams from '../assets/content/college.json';
import nbaTeams from '../assets/content/nba.json';

interface QuizProps {
    conference: string;
    classification: string;
};

interface Team {
    name: string;
    mascot: string;
    alternateNames: string[];
    conference: string;
    division?: string | null;
    classification: string;
    color: string;
    alternateColor: string;
    logo: string;
    city: string;
    state: string;
    stadium: string;
};

function Quiz({ conference, classification }: QuizProps) {

    /* Map the query paramater to the team JSON */
    const quizTypeMap: Record<string, Team[]> = {
        "fbs": collegeTeams,
        "nba": nbaTeams,
    };

    const [teamList, setTeamList] = useState<Team[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [points, setPoints] = useState(100);
    const [totalPoints, setTotalPoints] = useState(0);
    const [quizVisible, setQuizVisible] = useState(true);
    const [resultVisible, setResultVisible] = useState(false);
    const [answerVisible, setAnswerVisible] = useState(false);
    const [quizResultsArray, setQuizResultsArray] = useState<number[]>([]);

    /* Shuffle list of teams for the quiz */
    const shuffleArray = (array: Team[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    /* Filtering teams based on the map and setting them for the quiz */
    useEffect(() => {
        const teamsType = quizTypeMap[classification.toLowerCase()];
        const filteredTeams = (teamsType.filter(team => team.conference.toLowerCase() === conference));
        setTeamList(shuffleArray(filteredTeams));
    }, [conference]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const currentTeam = teamList[questionIndex];

        /* Check if the answer matches the name or alternate names */
        const formattedAnswer = userAnswer.trim().toLowerCase();
        const isCorrectAnswer = currentTeam.alternateNames.some(
            (name: string) => name.toLowerCase() === formattedAnswer
        ) || currentTeam.name.toLowerCase() === formattedAnswer;

        if (isCorrectAnswer) {
            /* Display result card */
            setAnswerVisible(true)

            /* Make sure card is visible for 3 seconds before storing results and resetting for the next question */
            setTimeout(() => {
                setAnswerVisible(false)
                setQuizResultsArray(prevResults => [...prevResults, attemptCount]);
                setAttemptCount(0);
                setTotalPoints(totalPoints => totalPoints + points);
                setPoints(100);

                if (questionIndex < teamList.length - 1) {
                    setQuestionIndex(prevIndex => prevIndex + 1);
                } else {
                    setQuizVisible(false);
                    setResultVisible(true);
                }
            }, 3000);        
        } else {
            /*  Reduce points for the round */
            setPoints(prevPoints => prevPoints - 20);

            setAttemptCount(prevAttempt => {
                if (prevAttempt === 4) {
                    setAnswerVisible(true);
                    setTimeout(() => {
                        setAnswerVisible(false);
                        setQuizResultsArray(prevResults => [...prevResults, attemptCount]);
                        setAttemptCount(0);
                        setTotalPoints(totalPoints => totalPoints + 0);
                        setPoints(100);
            
                        if (questionIndex < teamList.length - 1) {
                            setQuestionIndex(prevIndex => prevIndex + 1);
                        } else {
                            setQuizVisible(false);
                            setResultVisible(true);
                        }
                    }, 3000);
                }
                return prevAttempt + 1;
            });
        }

        /* Show results when quiz is over */
        if (questionIndex === teamList.length && teamList.length > 0) {
            setQuizVisible(false);
            setResultVisible(true);
        }

        /* Clear the text in the answer field */
        setUserAnswer("");
    };

    return (
        <div className="quiz-wrapper">
        <div className="quiz-window" id="quiz-window">

        {quizVisible && (
            <>
            <div className="quiz-question">
                <div className="quiz-color quiz-color--primary" style={{ backgroundColor: teamList[questionIndex]?.color }}>
                    <h2>Primary Color</h2>
                </div>
            </div>

            {attemptCount >= 1 && (
                <div className="quiz-question">
                    <div className="quiz-color quiz-color--secondary" id="q1" style={{ backgroundColor: teamList[questionIndex]?.alternateColor }}>
                        <h2>Secondary Color</h2>
                    </div>
                </div>
            )}

            {attemptCount >= 2 && (
                <div className="quiz-question--2" id="q2">
                    <p><span>Stadium</span> { teamList[questionIndex]?.stadium }</p>

                    {!teamList[questionIndex]?.division && (
                        <>
                        <p><span>Conference</span> { teamList[questionIndex]?.conference }</p>

                        <p><span>Location</span> { teamList[questionIndex]?.city }, { teamList[questionIndex]?.state }</p>
                        </>
                    )}

                    {teamList[questionIndex]?.division && (
                        <>
                        <p><span>Conference</span> { teamList[questionIndex]?.conference }</p>

                        <p><span>Division</span> { teamList[questionIndex]?.division }</p>
                        </>
                    )}
                </div>
            )}

            {attemptCount === 3 && (
                <div className="quiz-question--logo" id="q3">
                    <div className="quiz-logo quiz-logo--blackout" style={{ backgroundImage: `url(${ teamList[questionIndex]?.logo })` }}>
                    </div>
                </div>
            )}

            {attemptCount === 4 && (
                <div className="quiz-question--logo" id="q3">
                    <div className="quiz-logo" style={{ backgroundImage: `url(${ teamList[questionIndex]?.logo })` }}>
                    </div>
                </div>
            )}

            <div className="quiz-details">
                <div className="guesses">
                    {attemptCount >= 1 ? <p className="wrong">X</p> : <p>X</p>}
                    {attemptCount >= 2 ? <p className="wrong">X</p> : <p>X</p>}
                    {attemptCount >= 3 ? <p className="wrong">X</p> : <p>X</p>}
                    {attemptCount >= 4 ? <p className="wrong">X</p> : <p>X</p>}
                    {attemptCount >= 5 ? <p className="wrong">X</p> : <p>X</p>}
                </div>
                <div className="question-number">
                    <p>{ questionIndex + 1 } / { teamList.length }</p>
                </div>
            </div>  
            </>
        )}

        {resultVisible && (
            <div className="result-window" id="result-window">
                <a href='/'>← Back Home</a>
                <div className="results">
                    <p>Total Points: { totalPoints }</p>
                </div>
                {teamList.map((team, index) => {
                    const missedQuestions = quizResultsArray[index] || 0;

                    return (
                        <Card 
                            key={index} 
                            name={team.name} 
                            mascot={team.mascot} 
                            city={team.city} 
                            state={team.state} 
                            stadium={team.stadium} 
                            conference={team.conference} 
                            classification={team.classification} 
                            division={team.division ?? null}
                            logo={team.logo} 
                            color={team.color} 
                            attempts={missedQuestions}
                        />
                    );
                })}
            </div>
        )}

        {quizVisible && answerVisible == false && (
             <form className="answer-window" id="answer-window" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    id="answer" 
                    name="answer" 
                    placeholder="Input answer here..." 
                    autoComplete="off"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    autoFocus
                />
             <button type="submit">→</button>
            </form>
            )}
        </div>

        {answerVisible && (
            <div className="quiz-answer">
                <p>+ { points }</p>
                <Card
                    name={ teamList[questionIndex]?.name } 
                    mascot={ teamList[questionIndex]?.mascot } 
                    city={teamList[questionIndex]?.city} 
                    state={teamList[questionIndex]?.state} 
                    stadium={teamList[questionIndex]?.stadium} 
                    conference={teamList[questionIndex]?.conference}
                    division={teamList[questionIndex]?.division ?? null}
                    classification={teamList[questionIndex]?.classification} 
                    logo={teamList[questionIndex]?.logo} 
                    color={teamList[questionIndex]?.color}
                    attempts={attemptCount}
                />
            </div>
        )}
        </div>
    );
}

export default Quiz;