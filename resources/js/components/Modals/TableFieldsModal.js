import React, { useContext } from 'react';
import classNames from 'classnames';

import { ModalsContext } from '../Views';

const TableFieldsModal = props => {
    const {
        fields,
        customFields,
        closeModal
    } = props;

    const {
        modals
    } = useContext(ModalsContext);

    const onChange = e => {
        props.onChange(e.target.dataset.field, e.target.checked);
    }

    const modalClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (modals.tableFields) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (modals.tableFields) ? 'opacity-100' : 'opacity-0'
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
        (modals.tableFields) ? 'opacity-100' : 'opacity-0'
    )

    return (
        <div className={modalClass}>
            <div className={bdClass} aria-hidden="true" onClick={closeModal}></div>
            <section className="h-screen w-full fixed left-0 top-0 flex justify-center items-center" aria-labelledby="slide-over-heading">
                <div className={panelClass}>
                    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                        <div className="px-4 py-4 bg-indigo-600 dark:bg-indigo-500 text-white relative">
                            <div className="absolute top-0 right-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                                <button className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={closeModal}>
                                    <span className="sr-only">Close panel</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 id="slide-over-heading" className="text-lg font-medium">Choose Table Fields</h2>
                        </div>
                        <div>
                            <table className="table-fixed w-full">
                                <tbody>
                                    <tr>
                                        <td className="py-2 pl-4 w-64">Table Headings</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_headings"
                                                    checked={fields['table_headings'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Photo</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_photo"
                                                    checked={fields['table_photo'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Employee ID</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_employee_id"
                                                    checked={fields['table_employee_id'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Email Address</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_email"
                                                    checked={fields['table_email'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Phone Number</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_phone"
                                                    checked={fields['table_phone'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Department</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_department"
                                                    checked={fields['table_department'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pl-4">Job Title</td>
                                        <td className="px-6">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox"
                                                    data-field="table_title"
                                                    checked={fields['table_title'] || false}
                                                    onChange={onChange}
                                                    className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        customFields.map(function (field, i) {
                                            return (
                                                <tr key={i}>
                                                    <td className="py-2 pl-4">{field.label}</td>
                                                    <td className="px-6">
                                                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                            <input type="checkbox"
                                                                data-field={`table_${field.field}`}
                                                                checked={fields[`table_${field.field}`] || false}
                                                                onChange={onChange}
                                                                className="checked:bg-gray-500 outline-none focus:ring-0 focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                                            <label className="block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-700 cursor-pointer" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TableFieldsModal;
