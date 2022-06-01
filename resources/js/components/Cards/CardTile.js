import React, { useContext } from 'react';
import { WebAppsUXContext } from 'webapps-react';

const CardTile = props => {
    const {
        person,
        index
    } = props;
    const { theme } = useContext(WebAppsUXContext);

    const fullName = () => {
        let length = (person.forename.length + person.surname.length + 1);

        if (length <= 13) {
            return <h3 className="font-semibold">{person.forename} {person.surname}</h3>
        } else if (length <= 19) {
            return <h3 className="font-semibold" style={{ fontSize: '1.2rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        } else if (length <= 25) {
            return <h3 className="font-semibold" style={{ fontSize: '1rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        } else {
            return <h3 className="font-semibold" style={{ fontSize: '.8rem', lineHeight: '1.575rem' }}>{person.forename} {person.surname}</h3>
        }
    }

    const jobTitle = () => {
        if (person.title !== "" && person.title !== null) {
            if (person.title.length <= 31)
                return (<p className="italic">{person.title}</p>);
            else if (person.title.length <= 50)
                return (<p className="italic" style={{ fontSize: '.6rem', lineHeight: '1.4rem' }}>{person.title}</p>);
            else
                return (<p className="italic" style={{ fontSize: '.5rem', lineHeight: '1.4rem' }}>{person.title}</p>);
        }
    }

    const department = () => {
        if (person.departmentString.length === 0) {
            return <div className="mb-2 sm:mb-6" />
        } else if (person.departmentString.length <= 26 && person.departmentString !== null) {
            return <p className="font-semibold sm:mb-6">{person.departmentString}</p>
        } else if (person.departmentString.length <= 44) {
            return <p className="font-semibold sm:mb-6" style={{ fontSize: '.5rem', lineHeight: '1rem' }}>{person.departmentString}</p>
        } else if (person.departmentString.length <= 64) {
            return <p className="font-semibold sm:mb-6" style={{ fontSize: '.43rem', lineHeight: '1rem' }}>{person.departmentString}</p>
        }
    }

    const email = () => {
        if (person.email !== "" && person.email !== null) {
            return (
                <span className="flex-grow">
                    <a href={`mailto:${person.email}`} className="flex flex-row items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                        </svg>
                        Email
                    </a>
                </span>
            )
        }
    }

    const phone = () => {
        if (person.phone !== "" && person.phone !== null)
            return (
                <span className="flex-grow">
                    <a href={`tel:${person.phone}`} className="flex flex-row items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {person.phone}
                    </a>
                </span>
            )
    }

    return (
        <div data-order={index} data-surname={person.surname} data-id={person.id}
            className="card-tile inline-flex flex-col sm:flex-row mx-3 mb-4 w-80 h-80 sm:h-44 rounded-lg shadow-lg overflow-hidden">
            <div className="w-full sm:w-44">
                <img className="h-44 w-full"
                    src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                    id={`photo-${person.id}`}
                    alt={`${person.forename} ${person.surname} - Photo`} loading="lazy" />
            </div>
            <div className={`-mt-18 sm:mt-0 user-info inline-flex flex-col py-1 sm:py-6 px-2 relative h-44 w-full bg-${theme}-600 text-white text-center border-t-4 sm:border-t-0 sm:border-l-4 border-gray-800`}>
                {fullName()}
                {jobTitle()}
                {department()}
                <p className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-y-0 gap-x-2 justify-center text-sm">
                    {email()}
                    {phone()}
                </p>
            </div>
        </div>
    );
}

export default CardTile;
