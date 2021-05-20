import React from 'react';

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
                            <img key={i}
                                className="inline-block h-10 w-10 rounded-full border-2 border-gray-500 white dark:border-gray-50"
                                src={`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9)}.jpg`}
                                alt={`${person.forename} ${person.surname} - Photo`}
                            />
                        );
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