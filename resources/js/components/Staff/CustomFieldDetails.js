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
        <div className="bg-white dark:bg-gray-800 py-6 px-6 rounded shadow-xl mt-8">
            <section>
                <p className="text-xl font-semibold mb-6">Custom Fields</p>
                {
                    Object(fields).map(function (field) {
                        return (
                            <div className="flex flex-auto py-2" key={field.field}>
                                <div className="w-full lg:w-3/12">
                                    <label className="block py-2" htmlFor={field.field}>{field.label}</label>
                                </div>
                                <div className="w-full lg:w-9/12">
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
                                                        Object.keys(field.options).map(function(o) {
                                                            return <option value={o} key={o}>{field.options[o]}</option>
                                                        })
                                                    }
                                                </select>
                                            )
                                    }
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </div>
    )
}

export default CustomFieldDetails;