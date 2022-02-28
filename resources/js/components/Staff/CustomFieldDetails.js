import React from 'react';
import { Input, Select } from 'webapps-react';

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {
                        Object(fields).map(function (field, index) {
                            return (
                                (field.type === "text")
                                    ? <Input
                                        id={field.field}
                                        name={field.field}
                                        label={field.label}
                                        value={person.customFields[field.field] || ''}
                                        type="text"
                                        onChange={handleChange}
                                        key={field.field} />
                                    : (
                                        <Select
                                         id={field.field}
                                         name={field.field}
                                         label={field.label}
                                         value={person.customFields[field.field] || ''}
                                         onChange={handleChange}
                                         key={field.field}>
                                            <option value="">Not set</option>
                                            {
                                                Object.keys(field.options).map(function (o) {
                                                    return <option value={o} key={o}>{field.options[o]}</option>
                                                })
                                            }
                                        </Select>
                                    )
                            );
                        })
                    }
                </div>
            </section>
        </div>
    )
}

export default CustomFieldDetails;