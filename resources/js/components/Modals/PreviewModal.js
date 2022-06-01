import React, { useContext } from 'react';
import classNames from 'classnames';
import { FlyoutHeader } from 'webapps-react';

import { FlyoutContext } from '../Views';
import CustomView from '../CustomView';

const PreviewModal = props => {
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
                    <FlyoutHeader closeAction={closeModal}>Preview</FlyoutHeader>
                    <div className="px-4 sm:px-6 py-5 h-full overflow-y-auto">
                        <CustomView view={view} people={people} />
                    </div>
                </div>
            </section >
        </div >
    )
}

export default PreviewModal;
