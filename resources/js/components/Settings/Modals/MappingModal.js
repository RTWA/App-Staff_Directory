import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button, Select, withWebApps } from 'webapps-react';

import { ModalsContext } from '../SelectFields';

const MappingModal = ({ UI, ...props }) => {
    const {
        field,
        closeModal
    } = props;

    const {
        open,
        save,
    } = useContext(ModalsContext);

    const [value, setValue] = useState('do_not_sync');

    const prevField = useRef();

    useEffect(() => {
        if (field !== prevField) {
            setValue((field?.value) ? field.value : 'do_not_sync');
        }
        prevField.current = field;
    }, [field]);

    const onSelect = e => {
        setValue(e.target.value);
    }

    const onSave = e => {
        e.preventDefault();
        save(field, value);
    }

    const modalClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (open) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (open) ? 'opacity-100' : 'opacity-0'
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
        (open) ? 'opacity-100' : 'opacity-0'
    )

    return (
        <div className={modalClass}>
            <div className={bdClass} aria-hidden="true" onClick={closeModal}></div>
            <section className="h-screen w-full fixed left-0 top-0 flex justify-center items-center" aria-labelledby="slide-over-heading">
                <div className={panelClass}>
                    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                        <div className={`px-4 py-4 bg-${UI.theme}-600 dark:bg-${UI.theme}-500 text-white relative`}>
                            <div className="absolute top-0 right-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                                <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={closeModal}>
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 id="slide-over-heading" className="text-lg font-medium">Azure Attribute Mapping</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5">
                            <Select
                                id={`map_${field?.name}`}
                                name={`map_${field?.name}`}
                                label={`Select Azure attribute to map with ${field?.label}`}
                                onChange={onSelect}
                                value={value}>
                                <option value="do_not_sync">Do not sync this field</option>
                                <option value="aboutMe">aboutMe</option>
                                <option value="businessPhones">businessPhones</option>
                                <option value="city">city</option>
                                <option value="companyName">companyName</option>
                                <option value="country">country</option>
                                <option value="department">department</option>
                                <option value="displayName">displayName</option>
                                <option value="employeeHireDate">employeeHireDate</option>
                                <option value="employeeId">employeeId</option>
                                <option value="faxNumber">faxNumber</option>
                                <option value="givenName">givenName</option>
                                <option value="hireDate">hireDate</option>
                                <option value="jobTitle">jobTitle</option>
                                <option value="mail">mail</option>
                                <option value="mailNickname">mailNickname</option>
                                <option value="mobilePhone">mobilePhone</option>
                                <option value="officeLocation">officeLocation</option>
                                <option value="preferredName">preferredName</option>
                                <option value="state">state</option>
                                <option value="streetAddress">streetAddress</option>
                                <option value="surname">surname</option>
                                <option value="userPrincipalName">userPrincipalName</option>
                                <option value="extensionAttribute1">extensionAttribute1</option>
                                <option value="extensionAttribute2">extensionAttribute2</option>
                                <option value="extensionAttribute3">extensionAttribute3</option>
                                <option value="extensionAttribute4">extensionAttribute4</option>
                                <option value="extensionAttribute5">extensionAttribute5</option>
                                <option value="extensionAttribute6">extensionAttribute6</option>
                                <option value="extensionAttribute7">extensionAttribute7</option>
                                <option value="extensionAttribute8">extensionAttribute8</option>
                                <option value="extensionAttribute9">extensionAttribute9</option>
                                <option value="extensionAttribute10">extensionAttribute10</option>
                                <option value="extensionAttribute11">extensionAttribute11</option>
                                <option value="extensionAttribute12">extensionAttribute12</option>
                                <option value="extensionAttribute13">extensionAttribute13</option>
                                <option value="extensionAttribute14">extensionAttribute14</option>
                                <option value="extensionAttribute15">extensionAttribute15</option>
                            </Select>
                            <Button className="flex ml-auto" onClick={onSave}>Save</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default withWebApps(MappingModal);
