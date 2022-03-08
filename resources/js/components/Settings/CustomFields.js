import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { APIClient, Button, Input, Select, useToasts } from 'webapps-react';

const CustomFields = props => {
    const [tab, setTab] = useState(-1);
    const [custom, setCustom] = useState([]);
    const [changed, setChanged] = useState(false);

    const { addToast } = useToasts();

    const APIController = new AbortController();

    useEffect(async () => {
        await APIClient('/api/apps/StaffDirectory/customFields', undefined, { signal: APIController.signal })
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error)
                }
            });

        return () => {
            APIController.abort();
        }
    }, []);

    const saveData = async () => {
        await APIClient('/api/apps/StaffDirectory/customFields', { fields: JSON.stringify(custom) }, { signal: APIController.signal, method: 'PUT' })
            .then(json => {
                addToast('Custom Fields Saved', '', { appearance: 'success' });
                setCustom(json.data.list);
            })
            .catch(error => {
                if (!error.status?.isAbort) {
                    // TODO: Handle errors
                    console.log(error)
                    addToast('Unable to save Custom Fields!', '', { appearance: 'error' });
                }
            });
    }

    const toggle = _tab => {
        if (tab !== _tab) {
            setTab(_tab);
        } else {
            setTab(-1);
        }
    }

    const addField = () => {
        custom.push({
            id: 'new',
            field: custom.length + 1,
            label: 'New Custom Field',
            type: 'text',
            options: [],
        });
        setCustom([...custom]);
        setChanged(true);
    }

    const removeField = index => {
        custom.splice(index, 1);
        setCustom([...custom]);
        setChanged(true);
    }

    const onChange = e => {
        custom[e.target.dataset.for][e.target.name] = e.target.value;
        setCustom([...custom]);
        setChanged(true);
    }

    const optChange = e => {
        let value = [];
        e.target.value.split("\n").map(i => value.push(i));

        custom[e.target.dataset.for].options = value;
        setCustom([...custom]);
        setChanged(true);
    }

    const paneClass = id => classNames(
        'p-4',
        'bg-white',
        'dark:bg-gray-800',
        (tab === id) ? 'block' : 'hidden'
    )

    return (
        <>
            {
                (changed)
                    ? <Button color="green" className="block ml-auto mb-1 text-white hover:text-white" onClick={saveData}>Save Custom Fields</Button>
                    : null
            }
            {
                Object(custom).map(function (field, i) {
                    return (
                        <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2" key={i}>
                            <div className="flex flex-row w-full">
                                <p className="flex-1 p-4" onClick={() => toggle(i)}>Custom Field {i + 1}: {field.label}</p>
                            </div>
                            <div className={paneClass(i)}>
                                <Select
                                    id="type"
                                    name="type"
                                    label="Field Type"
                                    value={field.type}
                                    data-for={i}
                                    onChange={onChange}>
                                    <option value="">Unused</option>
                                    <option value="text">Text Box</option>
                                    <option value="select">Select List</option>
                                </Select>
                                <Input
                                    id="label"
                                    name="label"
                                    label="Field Name"
                                    type="text"
                                    value={field.label}
                                    data-for={i}
                                    onChange={onChange} />
                                <div className={`mb-6 ${(field.type === "select") ? '' : 'hidden'}`}>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select Options</label>
                                    <div className="w-full">
                                        <textarea name="options" className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 outline-none text-sm rounded-lg block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" onChange={optChange} data-for={i} rows={field.options.length} value={field.options.join("\n")} />
                                        <small id={`${i}Help`} className="text-gray-500 text-sm">
                                            Type each option on a new line. Do not re-order existing options.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            <button className="block mx-auto outline-none hover:text-indigo-600 dark:hover:text-indigo-500" onClick={addField}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Custom Field
            </button>
        </>
    );
}

export default CustomFields;