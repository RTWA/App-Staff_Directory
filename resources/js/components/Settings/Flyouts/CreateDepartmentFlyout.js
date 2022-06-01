import React, { useContext, useEffect, useState } from 'react';
import { APIClient, Button, FlyoutContent, FlyoutFooter, FlyoutHeader, Input, Select, useToasts } from 'webapps-react';

import { FlyoutsContext } from '../AppSettings';

const CreateDepartmentFlyout = props => {
    const {
        setDepartments,
        departments,
    } = props;

    const { addToast } = useToasts();

    const {
        current, closeFlyouts
    } = useContext(FlyoutsContext);

    const [name, setName] = useState('');
    const [parent, setParent] = useState('');
    const [state, setState] = useState('');
    const [error, setError] = useState('');

    const APIController = new AbortController();

    useEffect(() => {
        return () => {
            APIController.abort();
        }
    }, []);

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

    const createDepartment = async () => {
        setState('saving');

        await APIClient('/api/apps/StaffDirectory/department', { name: name, department_id: parent }, { signal: APIController.signal })
            .then(json => {
                setDepartments(json.data.departments);
                addToast("Department Created Successfully", '', { appearance: 'success' });
                setState('');
                closeFlyouts();
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    setState('error');
                    setError(error.response.data.errors.name[0]);
                }
            });
    }

    if (current !== 'CreateDepartment') {
        return null;
    }

    return (
        <>
            <FlyoutHeader closeAction={closeFlyouts}>
                Create New Department
            </FlyoutHeader>
            <FlyoutContent>
                <Input
                    id="name_cgf"
                    name="name"
                    label="Department Name"
                    type="text"
                    value={name}
                    onChange={typeValue}
                    error={error}
                    state={state} />
                <Select
                    id="newDepList"
                    name="newDepList"
                    label="Parent Department"
                    value={parent}
                    onChange={onParentChange}>
                    {
                        (departments.length === 0)
                            ? <option value="">No departments have been created yet</option>
                            : <option value="">No Parent Department</option>
                    }
                    {
                        (departments.length !== 0)
                            ? (
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
                            ) : null
                    }
                </Select>
            </FlyoutContent>
            <FlyoutFooter>
                <Button onClick={createDepartment} square type="outline">Create Department</Button>
                <Button onClick={closeFlyouts} color="gray" square type="outline" className="ml-auto">Cancel</Button>
            </FlyoutFooter>
        </>
    )
}

export default CreateDepartmentFlyout;
