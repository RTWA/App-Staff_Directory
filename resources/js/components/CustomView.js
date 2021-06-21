import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Button, Input } from 'webapps-react';

import { CardView, GridView, TableView } from './Views/index';

import './Selects/Select.css';

let emptyDepartment = { id: 'all', name: 'All Departments' };
let emptySubDepartment = { id: 'all', name: 'All Sub-Departments' };

const CustomView = props => {
    const {
        view
    } = props;

    const [me, setMe] = useState([]);
    const [tmpPeople, setTmpPeople] = useState([]);
    const [people, setPeople] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState(emptyDepartment);
    const [subDepartment, setSubDepartment] = useState(emptySubDepartment);
    const [selected, setSelected] = useState(emptyDepartment);
    const [onlyMe, setOnlyMe] = useState(false);
    const [filtered, setFiltered] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let formData = new FormData();
        formData.append('view', JSON.stringify(props.view));

        axios.post('/api/apps/StaffDirectory/view', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                setTmpPeople(json.data.people);
                setPeople(json.data.people);
                setDepartments(json.data.departments);
                setMe(json.data.me);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (view.display === "all") {
            setPeople(tmpPeople);
        }
        if (view.display === "department" && view.settings.department !== undefined && view.settings.department !== null) {
            depChange({ value: view.settings.department, label: 'to find' });
        }
        if (view.display === "person" && view.settings.person !== undefined && view.settings.person !== null) {
            let _people = [];
            Object(tmpPeople).map(function (person) {
                if (person.id === view.settings.person) {
                    _people.push(person);
                }
            });
            setPeople(_people);
        }
        if (view.display.includes('custom') && view.settings[view.display] !== undefined && view.settings[view.display] !== null) {
            let _people = [];
            Object(tmpPeople).map(function (person) {
                if (person.customFields[view.display] === view.settings[view.display]) {
                    _people.push(person);
                }
            });
            setPeople(_people);
        }
    }, [view]);

    const toggleMe = () => {
        if (!onlyMe && !filtered) {
            setDepartment(emptyDepartment);
            setSubDepartment(emptySubDepartment);
            setSelected(emptyDepartment);
            setOnlyMe(true);
            setFiltered(true);
            setPeople(tmpPeople);
            setSearch('');
        } else if (!onlyMe && filtered) {
            setDepartment(emptyDepartment);
            setSubDepartment(emptySubDepartment);
            setSelected(emptyDepartment);
            setOnlyMe(false);
            setFiltered(false);
            setPeople(tmpPeople);
            setSearch('');
        } else {
            setOnlyMe(false);
            setFiltered(false);
            setPeople(tmpPeople);
            setSearch('');
        }
    }

    const filter = e => {
        let search = e.target.value;
        if (search !== '') {
            let _people = [];
            people.map(function (person, i) {
                if (person.forename.toLowerCase().indexOf(search.toLowerCase()) !== -1
                    || person.surname.toLowerCase().indexOf(search.toLowerCase()) !== -1
                    || person.username.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                    _people.push(person);
                }
            });
            setDepartment(emptyDepartment);
            setSubDepartment(emptySubDepartment);
            setSelected(emptyDepartment);
            setOnlyMe(false);
            setFiltered(true);
            setPeople(_people);
            setSearch(search);
        } else {
            setDepartment(emptyDepartment);
            setSubDepartment(emptySubDepartment);
            setSelected(emptyDepartment);
            setOnlyMe(false);
            setFiltered(false);
            setPeople(tmpPeople);
            setSearch('');
        }
    }

    const options = sub => {
        let data = [];
        if (!sub) {
            data.push({ value: 'all', 'label': 'All Departments' });

            Object(departments).map(function (dep) {
                data.push({ value: dep.id, label: dep.name });
            });
        } else {
            data.push({ 'value': 'all', 'label': 'All Sub-Departments' });
            if (selected.children !== undefined) {
                Object(selected.children).map(function (child) {
                    data.push({ value: child.id, label: child.name });
                });
            }
        }
        return data;
    }

    const depChange = _selected => {
        if (_selected.label !== "All Sub-Departments") {
            Object(departments).map(function (dep) {
                if (dep.id == _selected.value) {
                    setDepartment(dep);
                    setSelected(dep);
                }

                if (dep.children !== undefined) {
                    Object(dep.children).map(function (child) {
                        if (child.id === _selected.value) {
                            setDepartment(dep);
                            setSubDepartment(child);
                            setSelected(child);
                        }
                    });
                }
            });
        } else {
            setDepartment(department);
            setSelected(emptySubDepartment);
        }

        setPeople(tmpPeople);
        setSearch('');
        setOnlyMe(false);
        setFiltered(true);
    }

    const selectedDep = sub => {
        if (!sub) {
            return { value: department.id, label: department.name };
        }
        return { value: subDepartment.id, label: subDepartment.name };
    }

    const leading = () => {
        if (view.settings.leading === "true" || view.settings.leading === true) {
            return <h4 id="leading">Place your cursor over the images to view further details of the staff members.</h4>
        }
        return null;
    }

    const sorttext = () => {
        if (view.settings.sorttext === "true" || view.settings.sorttext === true) {
            return <h3 id="filter">Showing All Staff <small>(Sorted by Employment Start Date)</small></h3>
        }
        return null;
    }

    const selectors = () => {
        if (view.settings.selectors === "true" || view.settings.selectors === true) {
            return (
                <div className="selectors">
                    <div className="flex flex-auto">
                        <div className="w-6/12 md:w-3/12 lg:w-2/12">
                            <Button square className="text-white" onClick={toggleMe}>
                            {
                                (filtered)
                                    ? 'Show All Staff'
                                    : 'Show Only Me'
                            }
                            </Button>
                        </div>
                        <div className="w-6/12 md:w-4/12 lg:w-5/12">
                            <Select options={options(false)} onChange={depChange} value={selectedDep(false)} className="input-field" classNamePrefix="input-select" />
                        </div>
                        <div className="w-6/12 md:w-4/12 lg:w-5/12">
                            {
                                (options(true).length === 1)
                                    ? null
                                    : <Select options={options(true)} onChange={depChange} value={selectedDep(true)} className="input-field" classNamePrefix="input-select" />
                            }
                        </div>
                    </div>
                    <div className="flex flex-auto">
                        <div className="w-6/12 md:w-3/12 lg:w-2/12">
                            <label className="block py-2" htmlFor="name">Search by name:</label>
                        </div>
                        <div className="w-6/12 md:4/12 lg:5/12">
                            <Input type="text" id="name" value={search} onChange={filter} />
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    const arrange = () => {
        if (view.display_type === "table") {
            return <TableView view={view} people={people} selected={selected} onlyMe={onlyMe} me={me} />
        }
        if (view.display_type === "grid" || view.display_type === "all") {
            return <GridView view={view} people={people} selected={selected} onlyMe={onlyMe} me={me} />
        }
        if (view.display_type === "card") {
            return <CardView view={view} people={people} selected={selected} onlyMe={onlyMe} me={me} />
        }

        return null;
    }

    return (
        <div id="content" className="p-1">
            {leading()}
            {selectors()}
            {sorttext()}
            <div id="data" className="flex flex-row m-2">
                {arrange()}
            </div>
        </div>
    )
}

export default CustomView;
