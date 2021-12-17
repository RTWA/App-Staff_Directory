import React from 'react';
import ReactUserAvatar from 'react-user-avatar';
import { withWebApps } from 'webapps-react';

import './styles/GridTile.css';

const GridTile = ({ UI, ...props }) => {
    const {
        person,
        hod,
        index
    } = props;

    if (!person) {
        return null;
    }

    return (
        <div data-order={index} data-surname={person.surname} data-id={person.id} className="flip-container mx-1 my-3 w-44 h-44">
            <div className="flipper relative duration-700">
                <div className="front w-44 h-44 overflow-hidden inline-block duration-700 absolute top-0 left-0 z-10">
                    <img className={`h-44 ${(person.onLeave === "1") ? 'opacity-40' : ''}`}
                        src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                        id={`photo-${person.id}`}
                        alt={`${person.forename} ${person.surname} - Photo`} />
                    <p className={`absolute bottom-0 w-full py-1 text-center font-medium text-white bg-${UI.theme}-600 bg-opacity-60 text-sm`}>
                        {person.forename} {person.surname}
                    </p>
                    {
                        (hod)
                            ? <p className={`absolute w-full py-1 text-center font-medium text-white bg-${UI.theme}-600 text-xs hod`}>Head of Department</p>
                            : null
                    }
                </div>
                <div className={`back w-44 h-44 overflow-hidden inline-block duration-700 absolute top-0 left-0 bg-${UI.theme}-300`}>
                    <ul className={`text-white p-1 bg-${UI.theme}-600 text-right my-2 h-40 leading-5`}>
                        <li>
                            {person.forename} {person.surname}
                            {
                                (person.employee_id !== null && person.employee_id !== '')
                                    ? <span className="employee_id"> - {person.employee_id}</span>
                                    : null
                            }
                        </li>
                        {
                            (person.email !== null && person.email !== '')
                                ? <li className="email"><a href={`mailto:${person.email}`} className="font-semibold text-xs hover:underline">E-Mail</a></li>
                                : null
                        }
                        <li className="department">{person.departmentString}</li>
                        {
                            (person.phone !== null && person.phone !== '')
                                ? <li className="phone">Tel: <a href={`tel:${person.phone}`} className="hover:underline">{person.phone}</a></li>
                                : null
                        }
                        {
                            (person.title !== null && person.title !== '')
                                ? <li className="title" className="text-sm">{person.title}</li>
                                : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default withWebApps(GridTile);