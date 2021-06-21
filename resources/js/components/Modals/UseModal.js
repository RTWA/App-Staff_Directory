import React, { useContext } from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useToasts } from 'react-toast-notifications';
import { withWebApps } from 'webapps-react';

import { ModalsContext } from '../Views';

const UseModal = ({ UI, ...props }) => {
    const {
        publicId,
        closeModal
    } = props;

    const {
        modals
    } = useContext(ModalsContext);

    const { addToast } = useToasts();

    const modalClass = classNames(
        'absolute',
        'inset-0',
        'overflow-hidden',
        (modals.useView) ? 'z-50' : '-z-10'
    )

    const bdClass = classNames(
        'absolute',
        'inset-0',
        'bg-gray-500',
        'bg-opacity-75',
        'transition-opacity',
        'duration-500',
        'ease-in-out',
        (modals.useView) ? 'opacity-100' : 'opacity-0'
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
        (modals.useView) ? 'opacity-100' : 'opacity-0'
    )

    const URL = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : '')}`;
    const link = `${URL}/apps/StaffDirectory/view/${publicId}`;
    const textarea = `<!-- TO MAKE CHANGES TO THIS COMPONENT, PLEASE RETURN TO ${URL} -->\r\n` +
        `<iframe src="${link}" style="width=100%;height:100%;border:0;overflow:hidden;" scrolling="no"></iframe>`;

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
                            <h2 id="slide-over-heading" className="text-lg font-medium">Use this view</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5">
                            <ol className="list-decimal px-6">
                                <li>Click into the box below to automatically select and copy the text.</li>
                                <li>Go the page you wish to display it on and enter edit mode.</li>
                                <li>Insert an HTML/Embed option and paste (<kbd>Ctrl</kbd>+<kbd>V</kbd>) the text below.</li>
                            </ol>
                            <CopyToClipboard text={textarea} onCopy={() => { addToast("Copied to clipboard!", { appearance: 'success' }) }}>
                                <textarea className="mt-2 w-full bg-gray-200 dark:bg-gray-700" value={textarea} readOnly rows="4" />
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default withWebApps(UseModal);
