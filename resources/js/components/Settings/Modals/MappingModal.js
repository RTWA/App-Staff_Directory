import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, FlyoutContent, FlyoutFooter, FlyoutHeader, Select, WebAppsUXContext } from 'webapps-react';

const MappingModal = props => {
    const {
        field,
        save,
        closeModal
    } = props;

    const [value, setValue] = useState('do_not_sync');

    const { useFlyouts } = useContext(WebAppsUXContext);
    const { flyout } = useFlyouts;

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

    if (!flyout.opened) {
        return null;
    }


    return (
        <>
            <FlyoutHeader closeAction={closeModal}>Azure Attribute Mapping</FlyoutHeader>
            <FlyoutContent>
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
            </FlyoutContent>
            <FlyoutFooter>
                <Button className="flex ml-auto" onClick={onSave}>Save</Button>
            </FlyoutFooter>
        </>
    )
}

export default MappingModal;
