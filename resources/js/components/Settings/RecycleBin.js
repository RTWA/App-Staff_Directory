import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Banner, Button, useToasts } from 'webapps-react';

const RecycleBin = props => {
    const [people, setPeople] = useState([]);

    const { addToast } = useToasts();

    useEffect(async () => {
        await axios.get('/api/apps/StaffDirectory/people/trashed')
            .then(json => {
                setPeople(json.data.people);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error)
            });
    }, []);

    const restore = async (e, id, index) => {
        e.preventDefault();

        await axios.get(`/api/apps/StaffDirectory/person/${id}/restore`)
            .then(json => {
                addToast(json.data.message, '', { appearance: 'success' });
                people.splice(index, 1);
                setPeople([...people]);
            })
            .catch(error => {
                // TODO: handle errors
                console.log(error);
            })
    }

    const empty = async () => {
        await axios.get('/api/apps/StaffDirectory/people/trashed/delete')
            .then(json => {
                setPeople(json.data.people);
            })
            .catch(error => {
                // TODO: Handle errors
                console.log(error)
            });
    }

    if (people.length === 0) {
        return <p className="text-center">You have nothing in the Recyle Bin!</p>
    }

    return (
        <>
            <Banner className="absolute top-0 left-0 right-0 text-center lg:text-left">
                Items in the Recycle Bin are deleted after 30 days.
                <Button style="link" color="gray" className="-my-2" onClick={empty}>
                    Empty the Recycle Bin now.
                </Button>
            </Banner>
            <div className="grid gap-y-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-20 sm:mt-14 lg:mt-10">
                {
                    Object(people).map(function (person, index) {
                        return (
                            <div className="w-full sm:w-auto flex flex-row items-center py-2 pl-5 mr-10 bg-gray-100 dark:bg-gray-700 rounded-lg" key={index}>
                                <img className="inline-block h-10 w-10 rounded-full border-2 border-gray-500 white dark:border-gray-50 mr-4"
                                    src={`/apps/StaffDirectory/view/person/${person.id}/photo`}
                                    id={`photo-${person.id}`}
                                    alt={`${person.forename} ${person.surname} - Photo`} />
                                <div className="flex flex-col justify-evenly">
                                    <p className="font-semibold">{person.forename} {person.surname}</p>
                                    <a href="#" onClick={(e) => { restore(e, person.id, index) }} className="text-xs text-red-500">Restore Person</a>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default RecycleBin;