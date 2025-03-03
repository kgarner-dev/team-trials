import React from "react";
import "./Card.scss";

interface CardProps {
    name: string;
    mascot: string;
    city: string;
    state: string;
    stadium: string;
    conference: string;
    classification: string;
    logo: string;
    color: string;
    division: string;
    attempts: number;
}

const Card: React.FC<CardProps> = ({ 
    name, 
    mascot, 
    city, 
    state, 
    stadium, 
    conference, 
    classification, 
    logo, 
    color,
    division,
    attempts
}) => {
    return (
        <div className="college-card" style={{ 
            background: color
        }}>
            <div className="college-attempts">
                <p>Attempts: { attempts + 1 }</p>
            </div>

            <div className="college-logo">
                <img src={logo} alt={`${name} Logo`} />
            </div>

            <div className="college-content">
                <div className="college-headline">
                    <h2>{name}</h2>
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

                    {!division && (
                        <div className="college-info--group">
                            <h2>Conference</h2>
                            <p>{conference}</p>
                        </div>
                    )}

                    {division && (
                         <div className="college-info--group">
                            <h2>Division</h2>
                            <p>{division}</p>
                        </div>
                    )}

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