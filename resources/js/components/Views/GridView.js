import React from 'react';
import { GridTile } from '../Cards';

const GridView = props => {
    const {
        people,
        onlyMe,
        me,
        selected
    } = props;

    if (onlyMe) {
        return <GridTile index={0} key={0} person={me} />;
    }

    let _tiles = [];
    let _people = [];

    Object(people).map(function (person, i) {
        if (selected.id !== "all") {
            Object(person.departments).map(function (dep) {
                if (dep.id === selected.id && !_people.includes(person)) {
                    _people.push(person);
                    _tiles.push(<GridTile index={i} key={i} person={person} hod={(person.id === dep.head_id)} />);
                }
                if (selected.children !== undefined) {
                    return (
                        Object(selected.children).map(function (child) {
                            if (child.id === dep.id && !_people.includes(person)) {
                                _people.push(person);
                                _tiles.push(<GridTile index={i} key={i} person={person} />);
                            }
                        })
                    );
                }
            })
        } else {
            _tiles.push(<GridTile index={i} key={i} person={person} />);
        }
    });

    return _tiles;
}

export default GridView;