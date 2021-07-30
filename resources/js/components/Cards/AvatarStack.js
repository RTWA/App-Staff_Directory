import React from 'react';
import ReactUserAvatar from 'react-user-avatar';

const AvatarStack = props => {
    const { people, fade, fadeTo, darkFadeTo } = props;

    const id = `avatarStack-${Math.floor(Math.random() * (Math.random() * 1000))}`;

    let _over = false;

    const mouseOver = () => {
        _over = true;
        setTimeout(() => {
            if (_over) {
                document.getElementById(id).classList.remove('-space-x-2');
                document.getElementById(id).classList.add('space-x-2');
            }
        }, 500);
    }

    const mouseOut = () => {
        _over = false;
        setTimeout(() => {
            if (!_over) {
                document.getElementById(id).classList.remove('space-x-2');
                document.getElementById(id).classList.add('-space-x-2');
            }
        }, 1500);
    }

    return (
        <div className="w-full overflow-hidden relative" onMouseOver={mouseOver} onMouseOut={mouseOut}>
            <div id={id} className="flex -space-x-2">
                {
                    Object(people).map(function (person, i) {
                        return (
                            ((person.azure_id !== undefined && person.azure_id !== null) ||
                                (person.local_photo !== undefined && person.local_photo !== null))
                                ? (
                                    <img key={i}
                                        className="inline-block h-10 w-10 rounded-full border-2 border-gray-500 white dark:border-gray-50"
                                        src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                                        id={`photo-${person.id}`}
                                        alt={`${person.forename} ${person.surname} - Photo`} />
                                )
                                : <ReactUserAvatar key={i} size="10" name={`${person.forename} ${person.surname}`} />
                        )
                    })
                }
            </div>
            {
                (fade)
                    ? <div className={`absolute bg-gradient-to-r from-transparent to-${fadeTo} dark:to-${darkFadeTo} w-full h-full top-0 left-0`}></div>
                    : null
            }
        </div>
    )
}

export default AvatarStack;