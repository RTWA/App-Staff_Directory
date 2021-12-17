import React from 'react';
import ReactUserAvatar from 'react-user-avatar';
import { useToasts } from 'react-toast-notifications';
import { Input, withWebApps } from 'webapps-react';

import { DatePicker } from '../DatePicker'

const PersonalDetails = ({ UI, ...props }) => {
    const {
        person,
        setPerson,
        change,
        dateChange
    } = props;

    const { addToast, updateToast } = useToasts();
    let toastId = '';

    const imageUpload = e => {
        if (person.id === 0) {
            addToast('Please save the record first', { appearence: 'warning', autoDismiss: 5000 });
            return;
        }

        let file = e.target.files.length ? e.target.files[0] : null;

        // Check if a file has actually been selected
        if (file !== null) {
            addToast('Uploading photo...', { appearence: 'info', autoDismiss: false }, id => toastId = id);

            // Upload the Image 
            let formData = new FormData();
            formData.append('file', file);
            axios.post(`/api/apps/StaffDirectory/person/${person.id}/photo`, formData)
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
                            content: "Photo uploaded!"
                        }
                    );
                })
                .catch(error => {
                    console.log(error);
                    updateToast(
                        toastId,
                        {
                            appearance: 'error',
                            autoDismiss: true,
                            autoDismissTimeout: 5000,
                            content: 'Failed to upload photo.'
                        }
                    );
                })
        }
    }

    return (
        <div className="relative bg-white dark:bg-gray-800 py-6 px-6 rounded shadow-xl">
            <div className={`w-20 h-20 text-white flex items-center absolute rounded-full p-2 shadow-xl bg-${UI.theme}-600 dark:bg-${UI.theme}-500 left-4 -top-6`}>
                {
                    (person.azure_id !== undefined && person.azure_id !== null)
                        ? <img className="w-20 rounded-full" src={`/apps/StaffDirectory/view/person/${person.id}/photo`} id="person-photo" alt={`${person.forename} ${person.surname} - Photo`} />
                        : (person.id !== 0)
                            ? (
                                <div className="relative cursor-pointer">
                                    <img className="w-20 rounded-full" src={`/apps/StaffDirectory/view/person/${person.id}/photo`} id="person-photo" alt={`${person.forename} ${person.surname} - Photo`} />
                                    <input type="file" name="image" accept="image/png, image/jpeg" onChange={imageUpload}
                                        className="absolute inset-0 w-full cursor-pointer opacity-0 m-0 p-0" />
                                </div>
                            )
                            : (
                                <div className="relative cursor-pointer" onClick={e => imageUpload(e)}>
                                    <ReactUserAvatar size="64" name={`${person.forename || 'Creating'} ${person.surname || 'New Record'}`} />
                                </div>
                            )
                }
            </div>
            <section>
                <p className="text-xl font-semibold my-2 ml-20 -mt-3">{person.forename || 'Creating'} {person.surname || 'New Record'}</p>
                <div className="flex flex-auto py-2 mt-8">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="forename">Forename</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="forename"
                                type="text"
                                id="forename"
                                value={person.forename || ''}
                                onChange={change} />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="surname">Surname</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="surname"
                                type="text"
                                id="surname"
                                value={person.surname || ''}
                                onChange={change} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="username">Username</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="username"
                                type="text"
                                id="username"
                                value={person.username || ''}
                                onChange={change} />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="employee_id">Employee ID</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="employee_id"
                                type="text"
                                id="employee_id"
                                value={person.employee_id || ''}
                                onChange={change} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-auto py-2">
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="email">Email Address</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <Input name="email"
                                type="text"
                                id="email"
                                value={person.email || ''}
                                onChange={change} />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 flex flex-auto px-2 lg:px-5">
                        <div className="w-full lg:w-3/12">
                            <label className="block py-2" htmlFor="employee_id">Start Date</label>
                        </div>
                        <div className="w-full lg:w-9/12">
                            <DatePicker value={person.startDate || ''} onDateChange={dateChange} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default withWebApps(PersonalDetails);