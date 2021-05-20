import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

import { FlyoutsContext } from '../AppSettings';
import Input from '../../Input';

const CreateDepartmentFlyout = props => {
    const {
        pushDepartment,
        departments,
    } = props;

    const { addToast } = useToasts();

    const {
        modals, toggleNew,
    } = useContext(FlyoutsContext);

    const [name, setName] = useState('');
    const [parent, setParent] = useState('');
    const [state, setState] = useState('');
    const [error, setError] = useState('');

    const flyoutClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (modals.new) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (modals.new) ? 'opacity-100' : 'opacity-0'
    )

    const panelClass = classNames(
        'relative',
        'w-screen',
        'max-w-2xl',
        'transform',
        'transition',
        'ease-in-out',
        'duration-500',
        'delay-500',
        (modals.new) ? 'translate-x-0' : 'translate-x-full'
    )

    const typeValue = e => {
        let _field = e.target.name;
        let _value = e.target.value;

        if (_field === "name") {
            setName(_value);
            setState('');
            setError('');
        }
    }

    const onParentChange = e => {
        setParent(e.target.value);
    }

    const createDepartment = () => {
        setState('saving');
        let formData = new FormData();
        formData.append('name', name);
        formData.append('department_id', parent);

        axios.post('/api/apps/StaffDirectory/department', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                pushDepartment(json.data.department);
                addToast("Department Created Successfully", { appearance: 'success' });
                toggleNew();
                setState('');
            })
            .catch(error => {
                setState('error');
                setError(error.response.data.errors.name[0]);
                console.log(error);
            });
    }

    return (
        <div className={flyoutClass}>
            <div className={bdClass} aria-hidden="true"></div>
            <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex" aria-labelledby="slide-over-heading">
                <div className={panelClass}>
                    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl overflow-y-auto relative">
                        <div className="px-4 sm:px-6 py-6 bg-indigo-600 text-white dark:text-gray-200 ">
                            <h2 id="slide-over-heading" className="text-lg font-medium">Create New Department</h2>
                        </div>
                        <div className="mt-6 relative flex-1 px-4 sm:px-6">
                            <div className="absolute inset-0 px-4 sm:px-6">
                                <div className="h-full" aria-hidden="true">
                                    <p className="text-gray-500">Department Name</p>
                                    <Input name="name"
                                        type="text"
                                        id="name_cgf"
                                        value={name}
                                        onChange={typeValue}
                                        error={error}
                                        state={state} />
                                    <p className="mt-6 text-gray-500">Parent Department</p>
                                    {
                                        (departments.length === 0) ?
                                            (
                                                <select id="newDepDepList" value={parent} onChange={onParentChange} className="input-field">
                                                    <option value="">No departments have been created yet</option>
                                                </select>
                                            ) :
                                            (
                                                <select id="newDepDepList" value={parent} onChange={onParentChange} className="input-field">
                                                    <option value="">No Parent Department</option>
                                                    {
                                                        Object(departments).map(function (department, i) {
                                                            let _return = [];
                                                            _return.push(
                                                                <option key={i} value={department.id}>{department.name}</option>
                                                            );

                                                            if (department.childrenCount !== 0) {
                                                                department.children.map(function (sub, si) {
                                                                    _return.push(
                                                                        <option key={`${i}-${si}`} value={sub.id}>{department.name} - {sub.name}</option>
                                                                    );
                                                                });
                                                            }
                                                            return _return;
                                                        })
                                                    }
                                                </select>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="relative bg-gray-100 dark:bg-gray-800 border-t-2 py-2 px-4 border-indigo-600 flex flex-row">
                            <button onClick={createDepartment} className="px-4 py-2 bg-indigo-600 border border-indigo-800 text-white hover:bg-indigo-800 dark:hover:bg-indigo-900">Create Department</button>
                            <button onClick={toggleNew} className="ml-auto px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-400 text-black dark:text-white hover:bg-gray-400">Cancel</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CreateDepartmentFlyout;
