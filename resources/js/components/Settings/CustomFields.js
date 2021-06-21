import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import { Button, Input } from 'webapps-react';

const CustomFields = props => {
    const [tab, setTab] = useState(-1);
    const [custom, setCustom] = useState([]);
    const [changed, setChanged] = useState(false);

    const { addToast } = useToasts();

    useEffect(() => {
        axios.get('/api/apps/StaffDirectory/customFields')
            .then(response => {
                return response;
            })
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error)
            });
    }, []);

    const saveData = () => {
        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('fields', JSON.stringify(custom));
        axios.post('/api/apps/StaffDirectory/customFields', formData)
            .then(response => {
                return response;
            })
            .then(json => {
                addToast('Custom Fields Saved', { appearance: 'success' });
                setCustom(json.data.list);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error)
                addToast('Unable to save Custom Fields!', { appearance: 'error' });
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
        'px-4',
        'bg-white',
        'dark:bg-gray-800',
        (tab === id) ? 'block' : 'hidden'
    )

    return (
        <>
            {
                (changed)
                    ? <Button color="green" className="block ml-auto mb-1 text-white hover:text-white" onClick={saveData}>Save Changes</Button>
                    : null
            }
            {
                Object(custom).map(function (field, i) {
                    return (
                        <div className="border cursor-pointer rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-700 mb-2" key={i}>
                            <div className="flex flex-row w-full">
                                <p className="flex-1 p-4" onClick={() => toggle(i)}>Custom Field {i + 1}: {field.label}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 m-4" viewBox="0 0 20 20" fill="currentColor" onClick={() => removeField(i)}>
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className={paneClass(i)}>
                                <div className="flex flex-auto p-2">
                                    <div className="w-full lg:w-3/12">
                                        <label className="block py-2">Field Type</label>
                                    </div>
                                    <div className="w-full lg:w-9/12">
                                        <select name="type" value={field.type} data-for={i} onChange={onChange} className="input-field">
                                            <option value="">Unused</option>
                                            <option value="text">Text Box</option>
                                            <option value="select">Select List</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`flex flex-auto p-2 ${(field.type === "select" || field.type === "text") ? '' : 'hidden'}`}>
                                    <div className="w-full lg:w-3/12">
                                        <label className="block py-2">Field Name</label>
                                    </div>
                                    <div className="w-full lg:w-9/12">
                                        <Input type="text" name="label" value={field.label} data-for={i} onChange={onChange} />
                                    </div>
                                </div>
                                <div className={`flex flex-auto p-2 ${(field.type === "select") ? '' : 'hidden'}`}>
                                    <div className="w-full lg:w-3/12">
                                        <label className="block py-2">Select Options</label>
                                    </div>
                                    <div className="w-full lg:w-9/12">
                                        <textarea name="options" className="input-field" onChange={optChange} data-for={i} rows={field.options.length} value={field.options.join("\n")} />
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