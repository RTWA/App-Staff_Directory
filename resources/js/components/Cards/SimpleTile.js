import React from 'react';
import { withWebApps } from 'webapps-react';

const SimpleTile = ({ UI, ...props }) => {
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

    return (
        <div data-order={index} data-surname={person.surname} data-id={person.id}
            className="inline-flex flex-col mx-3 mb-4 rounded-md shadow-lg p-0.5 bg-gray-50 dark:bg-gray-900">
            <img className="rounded-tl-md rounded-tr-md"
                src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                id={`photo-${person.id}`}
                alt={`${person.forename} ${person.surname} - Photo`} loading="lazy" />
            <div className="user-info px-2 bg-gray-50 dark:bg-gray-900 text-center">
                {fullName()}
            </div>
        </div>
    );
}

export default withWebApps(SimpleTile);
