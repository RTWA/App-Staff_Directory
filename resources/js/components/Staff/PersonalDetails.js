import React from 'react';
import ReactUserAvatar from 'react-user-avatar';
import { Input, useToasts, withWebApps } from 'webapps-react';

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
            let formData = new FormData();
            formData.append('file', file);
            await axios.post(`/api/apps/StaffDirectory/person/${person.id}/photo`, formData)
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
                })
        }
    }

    return (
        <div className="relative bg-white dark:bg-gray-800 p-4 rounded shadow-xl">
            <div className={`w-20 h-20 text-white flex items-center absolute rounded-full p-2 shadow-xl bg-${UI.theme}-600 dark:bg-${UI.theme}-500 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-4 -top-12 sm:-top-6`}>
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
                                <ReactUserAvatar size="64" name={`${person.forename || 'Creating'} ${person.surname || 'New Record'}`} />
                            </div>
                        )
                }
            </div>
            <section>
                <p className="text-xl font-semibold my-2 ml-0 text-center sm:text-left mt-4 sm:ml-24 sm:-mt-0">{person.forename || 'Creating'} {person.surname || 'New Record'}</p>
                <div className="flex flex-col sm:flex-row mt-2 sm:mt-6">
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="forename">Forename</label>
                        <Input name="forename"
                            type="text"
                            id="forename"
                            value={person.forename || ''}
                            onChange={change} />
                    </div>
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="surname">Surname</label>
                        <Input name="surname"
                            type="text"
                            id="surname"
                            value={person.surname || ''}
                            onChange={change} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="username">Username</label>
                        <Input name="username"
                            type="text"
                            id="username"
                            value={person.username || ''}
                            onChange={change} />
                    </div>
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="employee_id">Employee ID</label>
                        <Input name="employee_id"
                            type="text"
                            id="employee_id"
                            value={person.employee_id || ''}
                            onChange={change} />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="email">Email Address</label>
                        <Input name="email"
                            type="text"
                            id="email"
                            value={person.email || ''}
                            onChange={change} />
                    </div>
                    <div className="w-full sm:w-6/12 flex flex-col xl:flex-row py-1 px-2">
                        <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="employee_id">Start Date</label>
                        <DatePicker value={person.startDate || ''} onDateChange={dateChange} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default withWebApps(PersonalDetails);