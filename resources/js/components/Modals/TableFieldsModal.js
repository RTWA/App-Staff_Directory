import React, { useContext } from 'react';
import { FlyoutContent, FlyoutHeader, Switch } from 'webapps-react';

import { FlyoutContext } from '../Views';

const TableFieldsModal = props => {
    const {
        fields,
        customFields,
        close
    } = props;

    const {
        current
    } = useContext(FlyoutContext);

    const onChange = e => {
        props.onChange(e.target.dataset.field, e.target.checked);
    }

    if (current !== 'tableFields') {
        return null;
    }

    return (
        <>
            <FlyoutHeader closeAction={close}>
                Choose Table Fields
            </FlyoutHeader>
            <FlyoutContent>
                <Switch data-field="table_headings"
                    checked={fields['table_headings'] || false}
                    onChange={onChange}
                    label="Table Headings"
                    className="my-6"
                />
                <Switch
                    data-field="table_photo"
                    checked={fields['table_photo'] || false}
                    onChange={onChange}
                    label="Photo"
                    className="my-6"
                />
                <Switch
                    data-field="table_employee_id"
                    checked={fields['table_employee_id'] || false}
                    onChange={onChange}
                    label="Employee ID"
                    className="my-6"
                />
                <Switch
                    data-field="table_email"
                    checked={fields['table_email'] || false}
                    onChange={onChange}
                    label="Email Address"
                    className="my-6"
                />
                <Switch
                    data-field="table_phone"
                    checked={fields['table_phone'] || false}
                    onChange={onChange}
                    label="Phone Number"
                    className="my-6"
                />
                <Switch
                    data-field="table_department"
                    checked={fields['table_department'] || false}
                    onChange={onChange}
                    label="Department"
                    className="my-6"
                />
                <Switch
                    data-field="table_title"
                    checked={fields['table_title'] || false}
                    onChange={onChange}
                    label="Job Title"
                    className="my-6"
                />
                {
                    customFields.map(function (field, i) {
                        return (
                            <Switch
                                key={i}
                                data-field={`table_${field.field}`}
                                checked={fields[`table_${field.field}`] || false}
                                onChange={onChange}
                                label={field.label}
                                className="my-6"
                            />
                        );
                    })
                }
            </FlyoutContent>
        </>
    )
}

export default TableFieldsModal;
