import React from 'react';
import { CardTile } from '../Cards';

const CardView = props => {
    const {
        people,
        onlyMe,
        me,
        selected
    } = props;

    if (onlyMe) {
        return <CardTile index={0} key={0} person={me} />;
    }

    let _tiles = [];
    let _people = [];

    Object(people).map(function (person, i) {
        if (selected.id !== "all") {
            Object(person.departments).map(function (dep) {
                if (dep.id === selected.id && !_people.includes(person)) {
                    _people.push(person);
                    _tiles.push(<CardTile index={i} key={i} person={person} hod={(person.id === dep.head_id)} />);
                }
                if (selected.children !== undefined) {
                    return (
                        Object(selected.children).map(function (child) {
                            if (child.id === dep.id && !_people.includes(person)) {
                                _people.push(person);
                                _tiles.push(<CardTile index={i} key={i} person={person} />);
                            }
                        })
                    );
                }
            })
        } else {
            _tiles.push(<CardTile index={i} key={i} person={person} />);
        }
    });

    return _tiles;
}

export default CardView;