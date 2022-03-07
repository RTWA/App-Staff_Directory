import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { APIClient, Button, Input, withWebApps } from 'webapps-react';

import { CardView, GridView, TableView } from './Views/index';

import './Selects/Select.css';

let emptyDepartment = { id: 'all', name: 'All Departments' };
let emptySubDepartment = { id: 'all', name: 'All Sub-Departments' };

const CustomView = props => {
    const {
        UI,
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
    const [sortOrder, setSortOrder] = useState('(Sorted by Employment Start Date)');

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/StaffDirectory/view', { view: JSON.stringify(props.view) }, { signal: APIController.signal })
            .then(json => {
                setTmpPeople(json.data.people);
                setPeople(json.data.people);
                setDepartments(json.data.departments);
                setMe(json.data.me);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error);
                }
            });

        return () => {
            APIController.abort();
        }
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
        if (_selected.label === "All Departments") {
            setDepartment(emptyDepartment);
            setSubDepartment(emptySubDepartment);
            setSelected(emptyDepartment);
            setSortOrder('(Sorted by Employment Start Date)');
            tmpPeople.sort(function (a, b) {
                let keyA = new Date(a.startDate),
                    keyB = new Date(b.startDate);
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
            });
            setPeople(tmpPeople);
        } else if (_selected.label !== "All Sub-Departments") {
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
            setSortOrder('(Sorted by Surname)');
            tmpPeople.sort((a, b) => (a.surname > b.surname ? 1 : -1));
            setPeople(tmpPeople);
        } else {
            setDepartment(department);
            setSelected(emptySubDepartment);
            setSortOrder('(Sorted by Surname)');
            tmpPeople.sort((a, b) => (a.surname > b.surname ? 1 : -1));
            setPeople(tmpPeople);
        }

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
            return <h3 id="filter">Showing All Staff <small>{sortOrder}</small></h3>
        }
        return null;
    }

    const selectors = () => {
        if (view.settings.selectors === "true" || view.settings.selectors === true) {
            return (
                <div className="selectors">
                    <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-3/12 lg:w-2/12">
                            <Button square className="text-white w-full sm:w-auto" onClick={toggleMe}>
                                {
                                    (filtered)
                                        ? 'Show All Staff'
                                        : 'Show Only Me'
                                }
                            </Button>
                        </div>
                        <div className="w-full sm:w-4/12 lg:w-5/12">
                            <Select
                                options={options(false)}
                                onChange={depChange}
                                value={selectedDep(false)}
                                className={`bg-gray-50 text-gray-900 outline-none text-sm rounded-lg block w-full dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:ring-${UI.theme}-600 dark:focus:ring-${UI.theme}-500 focus:border-${UI.theme}-600 dark:focus:border-${UI.theme}-500`}
                                classNamePrefix="input-select" />
                        </div>
                        <div className="w-full sm:w-4/12 lg:w-5/12">
                            {
                                (options(true).length === 1)
                                    ? null
                                    : <Select
                                        options={options(true)}
                                        onChange={depChange}
                                        value={selectedDep(true)}
                                        className={`bg-gray-50 text-gray-900 outline-none text-sm rounded-lg block w-full dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:ring-${UI.theme}-600 dark:focus:ring-${UI.theme}-500 focus:border-${UI.theme}-600 dark:focus:border-${UI.theme}-500`}
                                        classNamePrefix="input-select" />
                            }
                        </div>
                    </div>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        label="Search by name:"
                        wrapperClassName="my-4 w-full sm:w-7/12"
                        value={search}
                        onChange={filter} />
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
            <div id="data" className="flex flex-row flex-wrap m-2">
                {arrange()}
            </div>
        </div>
    )
}

export default withWebApps(CustomView);
