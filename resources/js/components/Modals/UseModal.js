import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input, Textarea, useToasts } from 'webapps-react';

const UseModal = props => {
    const { publicId } = props;

    const { addToast } = useToasts();

    const URL = `${location.protocol}//${location.hostname}${(location.port ? `:${location.port}` : '')}`;
    const link = `${URL}/apps/StaffDirectory/view/${publicId}`;
    const textarea = `<!-- TO MAKE CHANGES TO THIS COMPONENT, PLEASE RETURN TO ${URL} -->\r\n` +
        `<iframe src="${link}" style="width=100%;height:100%;border:0;overflow:hidden;" scrolling="no"></iframe>`;

    return (
        <>
            <label htmlFor="simple-text" className="text-gray-600 dark:text-gray-400 text-sm font-normal">Embed the View in your web page</label>
            <CopyToClipboard text={textarea} onCopy={() => { addToast("Copied to clipboard!", '', { appearance: 'success' }) }}>
                <Textarea
                    id="simple-text"
                    name="simple-text"
                    wrapperClassName=""
                    readOnly
                    value={textarea}
                />
            </CopyToClipboard>
            <div className="relative my-6 h-px bg-gray-600 dark:bg-gray-400">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                    <span className="bg-white dark:bg-gray-800 px-4 text-xs text-gray-600 dark:text-gray-400 uppercase">Or</span>
                </div>
            </div>
            <label htmlFor="advanced-text" className="text-gray-600 dark:text-gray-400 text-sm font-normal">Provide a link to the View</label>
            <CopyToClipboard text={link} onCopy={() => { addToast("Copied to clipboard!", '', { appearance: 'success' }) }}>
                <Input
                    id="advanced-text"
                    name="advanced-text"
                    action={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    }
                    actionLocation="left"
                    wrapperClassName=""
                    readOnly
                    value={link}
                />
            </CopyToClipboard>
        </>
    )
}

export default UseModal;
