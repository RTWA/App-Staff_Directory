import React from 'react';

import './styles/GridTile.css';

const GridTile = props => {
    const {
        person,
        hod,
        index
    } = props;

    return (
        <div data-order={index} data-surname={person.surname} data-id={person.id} className="flip-container">
            <div className="flipper">
                <div className="front">
                    <img className="pic"
                        alt={`${person.forename} ${person.surname} - Photo`}
                        src={`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`}
                        id={`photo-${person.id}`} />
                    <p>{person.forename} {person.surname}</p>
                    {
                        (hod)
                            ? <p className="hod">Head of Department</p>
                            : null
                    }
                </div>
                <div className="back">
                    <ul className="info">
                        <li>
                            {person.forename} {person.surname}
                            {
                                (person.employee_id !== null || person.employee_id !== '')
                                    ? <span className="employee_id"> - {person.employee_id}</span>
                                    : null
                            }
                        </li>
                        {
                            (person.email !== null || person.email !== '')
                                ? <li className="email"><a href={`mailto:${person.email}`}>E-Mail</a></li>
                                : null
                        }
                        <li className="department">{person.departmentString}</li>
                        {
                            (person.phone !== null || person.phone !== '')
                                ? <li className="phone">Tel: {person.phone}</li>
                                : null
                        }
                        {
                            (person.title !== null || person.title !== '')
                                ? <li className="title">{person.title}</li>
                                : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GridTile;