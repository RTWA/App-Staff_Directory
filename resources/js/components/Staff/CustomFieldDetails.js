import React from 'react';
import { Input } from 'webapps-react';

const CustomFieldDetails = props => {
    const {
        person,
        fields,
        change,
    } = props;

    const handleChange = e => {
        change(e.target.id, e.target.value);
    }

    if (fields.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-6">Custom Fields</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
                    {
                        Object(fields).map(function (field, index) {
                            return (
                                <div className="w-full flex flex-col xl:flex-row py-1 px-2" key={field.field}>
                                    <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor={field.field}>{field.label}</label>
                                    {
                                        (field.type === "text")
                                            ? <Input name={field.field}
                                                type="text"
                                                id={field.field}
                                                value={person.customFields[field.field] || ''}
                                                onChange={handleChange} />
                                            : (
                                                <select name={field.field} id={field.field} value={person.customFields[field.field] || ''} onChange={handleChange} className="input-field">
                                                    <option value="">Not set</option>
                                                    {
                                                        Object.keys(field.options).map(function (o) {
                                                            return <option value={o} key={o}>{field.options[o]}</option>
                                                        })
                                                    }
                                                </select>
                                            )
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </section>
        </div>
    )
}

export default CustomFieldDetails;