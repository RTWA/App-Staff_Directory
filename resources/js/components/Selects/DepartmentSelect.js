import React from 'react';
import Select from 'react-select';

import './Select.css';

const DepartmentSelect = props => {
    const { departments } = props;

    const onChange = selected => {
        let value = selected.value;

        departments.map(function (dep) {
            if (dep.id == value) {
                value = dep;
            }
            Object.keys(dep.children).map(function (c) {
                if (dep.children[c].id == value) {
                    value = dep.children[c];
                }
            });
        });
        props.onChange(value, props.index)
    }

    const options = () => {
        let value = [{ value: 'none', label: 'None' }];

        departments.map(function (dep) {
            value.push({
                value: dep.id,
                label: dep.name
            });

            Object.keys(dep.children).map(function (c) {
                value.push({
                    value: dep.children[c].id,
                    label: `${dep.name} - ${dep.children[c].name}`
                });
            });
        });
        return value;
    }

    const selected = () => {
        let value = [{ value: 'none', label: 'None' }];

        departments.map(function (dep) {
            if (props.selected.id == dep.id) {
                value = {
                    value: dep.id,
                    label: dep.name
                };
            }

            Object.keys(dep.children).map(function (c) {
                if (props.selected.id == dep.children[c].id) {
                    value = {
                        value: dep.children[c].id,
                        label: `${dep.name} - ${dep.children[c].name}`
                    };
                }
            });
        });
        return value;
    }

    return <Select options={options()} onChange={onChange} value={selected()} className="input-field" classNamePrefix="input-select" />
}

export default DepartmentSelect;