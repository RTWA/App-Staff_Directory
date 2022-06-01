import React, { useContext } from 'react';
import classNames from 'classnames';
import { withWebApps } from 'webapps-react';

import { FlyoutContext } from '../Views';
import CustomView from '../CustomView';

const PreviewModal = ({ UI, ...props }) => {
    const {
        view,
        people,
        closeModal
    } = props;

    const {
        current
    } = useContext(FlyoutContext);

    if (current !== 'preview') {
        return null;
    }

    const modalClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'opacity-100'
    )

    const panelClass = classNames(
        'relative',
        'w-screen',
        'max-w-7xl',
        'h-5/6',
        'opacity-100'
    )

    return (
        <div className={modalClass} style={{ zIndex: 2000 }}>
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
                            <h2 id="slide-over-heading" className="text-lg font-medium">Preview</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5 h-full overflow-y-auto">
                            <CustomView view={view} people={people} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default withWebApps(PreviewModal);
