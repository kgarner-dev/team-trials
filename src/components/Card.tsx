import React from "react";
import "./Card.scss";

interface CardProps {
    school: string;
    mascot: string;
    city: string;
    state: string;
    stadium: string;
    conference: string;
    classification: string;
    logo: string;
    color: string;
    grayscale: number;
}

const Card: React.FC<CardProps> = ({ 
    school, 
    mascot, 
    city, 
    state, 
    stadium, 
    conference, 
    classification, 
    logo, 
    color,
    grayscale
}) => {
    return (
        <div className="college-card" style={{ 
            background: color,
            filter: `grayscale(${grayscale}%)`
        }}>
            <div className="college-logo">
                <img src={logo} alt={`${school} Logo`} />
            </div>

            <div className="college-content">
                <div className="college-headline">
                    <h1>{school}</h1>
                    <p>{mascot}</p>
                </div>
                <div className="college-info">
                    <div className="college-info--group">
                        <h2>Location</h2>
                        <p>
                            {city}, {state}
                        </p>
                    </div>

                    <div className="college-info--group">
                        <h2>Stadium</h2>
                        <p>{stadium}</p>
                    </div>

                    <div className="college-info--group">
                        <h2>Conference</h2>
                        <p>{conference}</p>
                    </div>

                    <div className="college-info--group">
                        <h2>Classification</h2>
                        <p className="classification">{classification}</p>
                    </div>
                </div>
            </div>

            <div
                className="college-decoration"
                style={{
                    background: `url('${logo}') center center/cover no-repeat`,
                }}
            ></div>
        </div>
    );
}

export default Card;