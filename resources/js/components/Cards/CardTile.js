import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import './styles/CardTile.css';

const CardTile = props => {
    const {
        person,
        index
    } = props;

    const fullName = () => {
        let length = (person.forename.length + person.surname.length + 1);

        if (length <= 13) {
            return <h3>{person.forename} {person.surname}</h3>
        } else if (length <= 19) {
            return <h3 style={{ fontSize: '1.2rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        } else if (length <= 25) {
            return <h3 style={{ fontSize: '1rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        } else {
            return <h3 style={{ fontSize: '.8rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        }
    }

    const jobTitle = () => {
        if (person.title !== "" && person.title !== null) {
            if (person.title.length <= 31)
                return (<p className="title">{person.title}</p>);
            else if (person.title.length <= 50)
                return (<p className="title" style={{ fontSize: '.6rem', lineHeight: '1.4rem' }}>{person.title}</p>);
            else
                return (<p className="title" style={{ fontSize: '.5rem', lineHeight: '1.4rem' }}>{person.title}</p>);
        }
    }

    const department = () => {
        if (person.departmentString.length <= 26 && person.departmentString !== null) {
            return <p className="department">{person.departmentString}</p>
        } else if (person.departmentString.length <= 44) {
            return <p className="department" style={{ fontSize: '.5rem', lineHeight: '1rem' }}>{person.departmentString}</p>
        } else if (person.departmentString.length <= 64) {
            return <p className="department" style={{ fontSize: '.43rem', lineHeight: '1rem' }}>{person.departmentString}</p>
        }
    }

    const email = () => {
        if (person.email !== "" && person.email !== null) {
            return <span className="email"><a href={`mailto:${person.email}`}><FontAwesomeIcon icon={['fas', 'envelope']} className="mr-1" />E-Mail</a></span>
        }
    }

    const phone = () => {
        if (person.phone !== "" && person.phone !== null)
            return (
                <span className="phone"><FontAwesomeIcon icon={['fas', 'phone']} className="mr-1" />{person.phone}</span>
            )
    }

    return (
        <div data-order={index} data-surname={person.surname} data-id={person.id} className="card-tile">

            <div className="user-photo">
                <img className="pic"
                    alt={`${person.forename} ${person.surname} - Photo`}
                    src={`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`}
                    id={`photo-${person.id}`} />
            </div>

            <div className="user-info">
                {fullName()}
                {jobTitle()}
                {department()}
                <p className="contacts">
                    {email()}
                    {phone()}
                </p>
            </div>
        </div>
    );
}

export default CardTile;