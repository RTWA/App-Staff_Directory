import React, { useContext, useEffect } from 'react';
import { APIClient, Input, UserAvatar, useToasts, WebAppsUXContext } from 'webapps-react';

import { DatePicker } from '../DatePicker'

const PersonalDetails = props => {
    const {
        person,
        setPerson,
        change,
        dateChange,
        hide,
        isAzureMapped,
        azureIcon,
    } = props;
    const { theme } = useContext(WebAppsUXContext);

    const { addToast, updateToast } = useToasts();
    let toastId = '';

    const APIController = new AbortController();

    useEffect(() => {
        return () => {
            APIController.abort();
        }
    }, []);

    const imageUpload = async e => {
        if (person.id === 0) {
            addToast('Please save the record first', '', { appearence: 'warning', autoDismiss: 5000 });
            return;
        }

        let file = e.target.files.length ? e.target.files[0] : null;

        // Check if a file has actually been selected
        if (file !== null) {
            addToast('Uploading photo...', '', { appearence: 'info', autoDismiss: false }, id => toastId = id);

            // Upload the Image
            await APIClient(`/api/apps/StaffDirectory/person/${person.id}/photo`, { file: file }, { signal: APIController.signal })
                .then(json => {
                    person.local_photo = json.data.local_photo;
                    setPerson({ ...person });

                    document.getElementById('person-photo')
                        .src = `/apps/StaffDirectory/view/person/${person.id}/photo?v=${new Date().getTime()}`

                    updateToast(
                        toastId,
                        {
                            appearance: 'success',
                            autoDismiss: true,
                            autoDismissTimeout: 3000,
                            title: "Photo uploaded!"
                        }
                    );
                })
                .catch(error => {
                    if (!error.status?.isAbort) {
                        console.log(error);
                        updateToast(
                            toastId,
                            {
                                appearance: 'error',
                                autoDismiss: true,
                                autoDismissTimeout: 5000,
                                title: 'Failed to upload photo.'
                            }
                        );
                    }
                })
        }
    }

    return (
        <div className="relative bg-white dark:bg-gray-800 p-4 rounded shadow-xl">
            <div className={`w-20 h-20 text-white flex items-center absolute rounded-full p-2 shadow-xl bg-${theme}-600 dark:bg-${theme}-500 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-4 -top-12 sm:-top-6`}>
                {
                    (person.id !== 0)
                        ? (
                            <div className="relative cursor-pointer">
                                <img className="w-20 rounded-full" src={`/apps/StaffDirectory/view/person/${person.id}/photo`} id="person-photo" alt={`${person.forename} ${person.surname} - Photo`} />
                                {
                                    (person.azure_id !== undefined && person.azure_id !== null)
                                        ? null
                                        : <input type="file" name="image" accept="image/png, image/jpeg" onChange={imageUpload}
                                            className="absolute inset-0 w-full cursor-pointer opacity-0 m-0 p-0" />
                                }
                            </div>
                        )
                        : (
                            <div className="relative cursor-pointer" onClick={e => imageUpload(e)}>
                                <UserAvatar size="64" name={`${person.forename || 'Creating'} ${person.surname || 'New Record'}`} />
                            </div>
                        )
                }
            </div>
            <section>
                <p className="text-xl font-semibold my-2 ml-0 text-center sm:text-left mt-4 sm:ml-24 sm:-mt-0 sm:mb-8">{person.forename || 'Creating'} {person.surname || 'New Record'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <Input
                        id="forename"
                        name="forename"
                        label="Forename"
                        type="text"
                        value={person.forename || ''}
                        onChange={change}
                        action={(isAzureMapped('forename')) ? azureIcon : null}
                        readOnly={(isAzureMapped('forename')) ? true : null}
                        inputClassName={(isAzureMapped('forename')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                    <Input
                        id="surname"
                        name="surname"
                        label="Surname"
                        type="text"
                        value={person.surname || ''}
                        onChange={change}
                        action={(isAzureMapped('surname')) ? azureIcon : null}
                        readOnly={(isAzureMapped('surname')) ? true : null}
                        inputClassName={(isAzureMapped('surname')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                    {
                        (hide.includes('username'))
                            ? null
                            : (
                                <Input
                                    id="username"
                                    name="username"
                                    label="Username"
                                    type="text"
                                    value={person.username || ''}
                                    onChange={change}
                                    action={(isAzureMapped('username')) ? azureIcon : null}
                                    readOnly={(isAzureMapped('username')) ? true : null}
                                    inputClassName={(isAzureMapped('username')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                            )
                    }
                    {
                        (hide.includes('employee_id'))
                            ? null
                            : (
                                <Input
                                    id="employee_id"
                                    name="employee_id"
                                    label="Employee ID"
                                    type="text"
                                    value={person.employee_id || ''}
                                    onChange={change}
                                    action={(isAzureMapped('employee_id')) ? azureIcon : null}
                                    readOnly={(isAzureMapped('employee_id')) ? true : null}
                                    inputClassName={(isAzureMapped('employee_id')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                            )
                    }
                    {
                        (hide.includes('email'))
                            ? null
                            : (<Input
                                id="email"
                                name="email"
                                label="Email Address"
                                type="text"
                                value={person.email || ''}
                                onChange={change}
                                action={(isAzureMapped('email')) ? azureIcon : null}
                                readOnly={(isAzureMapped('email')) ? true : null}
                                inputClassName={(isAzureMapped('email')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                            )
                    }
                    {
                        (hide.includes('startDate'))
                            ? null
                            : (
                                <DatePicker
                                    id="startDate"
                                    name="startDate"
                                    label="Start Date"
                                    value={person.startDate || ''}
                                    onDateChange={dateChange}
                                    action={(isAzureMapped('startDate')) ? azureIcon : null}
                                    readOnly={(isAzureMapped('startDate')) ? true : null}
                                    inputClassName={(isAzureMapped('startDate')) ? 'cursor-not-allowed border-blue-300 dark:border-blue-600' : null} />
                            )
                    }
                </div>
            </section>
        </div>
    );
}

export default PersonalDetails;