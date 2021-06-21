import React from 'react';
import ReactUserAvatar from 'react-user-avatar';

const AvatarPill = props => {
    const { person, hover } = props;

    let _over = false;

    const mouseOver = () => {
        _over = true;
        setTimeout(() => {
            if (_over && (hover === undefined || hover)) {
                document.getElementById(`details-${person.id}`).classList.remove('-translate-x-64');
            }
        }, 500);
    }

    const mouseOut = () => {
        _over = false;
        setTimeout(() => {
            if (!_over && (hover === undefined || hover)) {
                document.getElementById(`details-${person.id}`).classList.add('-translate-x-64');
            }
        }, 1500);
    }

    if (person === undefined || person === null)
        return null;

    return (
        <div id={`avatarPill-${person.id}`}
            className="relative w-64 h-16 overflow-hidden rounded-full"
            onMouseOver={mouseOver}
            onMouseOut={mouseOut}>
            <div id={`details-${person.id}`}
                className="absolute flex flex-col justify-evenly pl-20 cursor-default w-64 h-16 top-0 left-0 rounded-full shadow-xl bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-white transform -translate-x-64 transition-transform">
                <p className="font-semibold">{person.forename} {person.surname}</p>
                <p className="italic text-gray-400">{person.title}</p>
            </div>
            {/* TODO: Allow manual photo */}
            {
                (person.azure_id !== undefined && person.azure_id !== null)
                    ? (
                        <img className="absolute top-0 left-0 w-16 h-16 rounded-full box-border border-2 border-gray-500 dark:border-gray-400"
                            src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                            id={`photo-${person.id}`}
                            alt={`${person.forename} ${person.surname} - Photo`} />
                    )
                    : <ReactUserAvatar size="16" name={`${person.forename} ${person.surname}`} />
            }
        </div>
    );
}

export default AvatarPill;