import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './styles/TableView.css';

const TableView = props => {
    const {
        view,
        people,
        onlyMe,
        me,
        selected
    } = props;

    const [custom, setCustom] = useState([]);

    useEffect(async () => {
        await axios.get('/api/apps/StaffDirectory/customFields')
            .then(json => {
                setCustom(json.data.list);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error);
            });
    }, []);

    const headings = () => {
        let fields = view.settings.fields;
        let _headings = [];

        if (fields.table_photo || fields.table_photo === "true") {
            _headings.push(<th key="photo" className="photo" />);
        }

        _headings.push(<th key="surname" className="surname">Surname</th>);
        _headings.push(<th key="forename" className="forename">Forename</th>);

        if (fields.table_employee_id || fields.table_employee_id === "true") {
            _headings.push(<th key="employee_id" className="employee_id">Employee ID</th>);
        }
        if (fields.table_email || fields.table_email === "true") {
            _headings.push(<th key="email" className="email">Email Address</th>);
        }
        if (fields.table_phone || fields.table_phone === "true") {
            _headings.push(<th key="phone" className="phone">Phone Number</th>);
        }
        if (fields.table_department || fields.table_department === "true") {
            _headings.push(<th key="department" className="department">Department</th>);
        }
        if (fields.table_title || fields.table_title === "true") {
            _headings.push(<th key="title" className="title">Job Title</th>);
        }

        Object(custom).map(function (field, i) {
            if (fields[`table_${field.field}`] || fields[`table_${field.field}`] === "true") {
                _headings.push(<th key={i} className={field.field}>{field.label}</th>);
            }
        });

        if (fields.table_headings || fields.table_headings === "true") {
            return (<thead className="headings" key="h0"><tr>{_headings}</tr></thead>);
        }
    }

    const rows = () => {
        let fields = view.settings.fields;
        let _rows = [];

        if (onlyMe) {
            return myRow();
        }

        Object(people).map(function (person, i) {
            let _row = [];

            if (fields.table_photo || fields.table_photo === "true") {
                _row.push(
                    <td key={`photo-${person.id}`} className="photo">
                        <img src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                            id={`photo-${person.id}`} className="object-cover my-1 h-10 w-full"
                            alt={`${person.forename} ${person.surname} - Photo`} loading="lazy" />
                    </td>);
            }

            _row.push(<td key={`surname-${person.id}`} className="surname">{person.surname}</td>);
            _row.push(<td key={`forename-${person.id}`} className="forename">{person.forename}</td>);

            if (fields.table_employee_id || fields.table_employee_id === "true") {
                _row.push(<td key={`employee_id-${person.id}`} className="employee_id">{person.employee_id}</td>);
            }
            if (fields.table_email || fields.table_email === "true") {
                _row.push(<td key={`email-${person.id}`} className="email"><a href={`mailto:${person.email}`} className="hover:underline">{person.email}</a></td>);
            }
            if (fields.table_phone || fields.table_phone === "true") {
                _row.push(<td key={`phone-${person.id}`} className="phone"><a href={`mailto:${person.phone}`} className="hover:underline">{person.phone}</a></td>);
            }
            if (fields.table_department || fields.table_department === "true") {
                _row.push(<td key={`department-${person.id}`} className="department">{person.departmentString}</td>);
            }
            if (fields.table_title || fields.table_title === "true") {
                _row.push(<td key={`title-${person.id}`} className="title">{person.title}</td>);
            }

            Object(custom).map(function (field, i) {
                if (fields[`table_${field.field}`] || fields[`table_${field.field}`] === "true") {
                    if (field.type === "text") {
                        _row.push(<td key={`${field.field}-${person.id}`} className={field.field}>{person.customFields[field.field]}</td>);
                    } else if (field.type === "select") {
                        _row.push(<td key={`${field.field}-${person.id}`} className={field.field}>{field.options[person.customFields[field.field]]}</td>);
                    }
                }
            });

            _rows.push(<tr key={i}>{_row}</tr>);
        });

        return <tbody>{_rows}</tbody>
    }

    const myRow = () => {
        let fields = view.settings.fields;
        let person = me;
        let _rows = [];
        let _row = [];

        if (fields.table_photo || fields.table_photo === "true") {
            _row.push(
                <td key={`photo-${person.id}`} className="photo">
                    <img src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                        id={`photo-${person.id}`}
                        alt={`${person.forename} ${person.surname} - Photo`} />
                </td>);
        }

        _row.push(<td key={`surname-${person.id}`} className="surname">{person.surname}</td>);
        _row.push(<td key={`forename-${person.id}`} className="forename">{person.forename}</td>);

        if (fields.table_employee_id || fields.table_employee_id === "true") {
            _row.push(<td key={`employee_id-${person.id}`} className="employee_id">{person.employee_id}</td>);
        }
        if (fields.table_email || fields.table_email === "true") {
            _row.push(<td key={`email-${person.id}`} className="email">{person.email}</td>);
        }
        if (fields.table_phone || fields.table_phone === "true") {
            _row.push(<td key={`phone-${person.id}`} className="phone">{person.phone}</td>);
        }
        if (fields.table_department || fields.table_department === "true") {
            _row.push(<td key={`department-${person.id}`} className="department">{person.departmentString}</td>);
        }
        if (fields.table_title || fields.table_title === "true") {
            _row.push(<td key={`title-${person.id}`} className="title">{person.title}</td>);
        }

        Object(custom).map(function (field, i) {
            if (fields[`table_${field.field}`] || fields[`table_${field.field}`] === "true") {
                if (field.type === "text") {
                    _row.push(<td key={`${field.field}-${person.id}`} className={field.field}>{person.customFields[field.field]}</td>);
                } else if (field.type === "select") {
                    _row.push(<td key={`${field.field}-${person.id}`} className={field.field}>{field.options[person.customFields[field.field]]}</td>);
                }
            }
        });

        _rows.push(<tr key={0}>{_row}</tr>);

        return <tbody>{_rows}</tbody>
    }

    return (
        <div className="w-screen max-w-full overflow-x-auto">
            <table className="table w-full StaffDirectory">
                {headings()}
                {rows()}
            </table>
        </div>
    );
}

export default TableView;