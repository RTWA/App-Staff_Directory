# Version 1.1.0
## What's New?
- Added ability to delete custom views
- Added ability to sync custom fields with Azure (strings only)

## What's Changed?
- Updated all screens to use new WebApps UX

## What's Fixed?
- An issue with Azure sync and sub-departments of the same name
- An issue preventing the App being installed when using MS SQL Server database
- An issue preventing the App being uninstalled when using MS SQL Server database
- An issue with the embed code for views

---

# Version 1.0.9
## What's New?
- Staff Directory now uses the new WebApps pop-up window for authentication when required in Views

## What's Changed?
- The department list of Views is now alphabetised

## What's Fixed?
- Setting a department head in App Settings doesn't cause the departments list to go wrong until the page was refreshed
- Updating the App no longer resets your Azure Field Mappings

---

# Version 1.0.8
## What's Fixed?
- Issues when syncing records with Azure
  - Removes all departments from user before re-applying current ones
  - Syncs sub-departments with the correct parent department
- The list of people is correctly sorted
  - Sorted by Start Date when All Staff are displayed
  - Sorted by Surname when a department, or sub-department is selected
- The sorted by text is now correctly updated
- Selecting a sub-department now does not remove the sub-departments list
- Selecting a sub-department, switching to a different department and returning to the parent department now clears the selected sub-department
- Department list now loads correctly when a Department is deleted
- Department list now loads correctly when a Department is created
- All department lists are now shown alphabetically
- Custom Fields now save correctly
- Group Access to Views now works correctly

## What's Changed?
- Security Updates

---

# Version 1.0.7
## What's Fixed?
- Fixed an issue with Azure Field Mappings for new records
- Fixed an issue preventing Custom Field values from saving
- Syncing a record using ExtensionAttributes, when none are set, now no longer prevents the entire sync from running
- Improved UI of GridTile Layout

---

# Version 1.0.6
## What's New?
- You can now select which Azure attributes to use to synchronise your Users with
- If a User's department contains an ampersand (`&`) character with a space on either side of it, Staff Directory will split the string into two departments (e.g `Black & White` will put the User into both the `Black` and `White` departments). The ` - ` sub-department separator continues to work as before and these two can be combined (e.g `Colours - Black & Triangle` will put the User into both `Colours - Black` and `Triangle` departments)
- When editing a record that has been synced with Azure, a new option appears labelled `Do not sync this person with Azure again` - clicking this will add the username to the "Do Not Sync" list. All fields will become writeable again and the user will never sync with Azure
- You can remove users from the "Do Not Sync" list from App Settings > Microsoft Azure Integration

## What's Changed?
- When editing a record that has been synced with Azure the fields that are managed by Azure are now read-only

---

# Version 1.0.5
## What's New?
- Added option to select which fields appear in edit staff view
- New "Simple Card" view

## What's Fixed?
- Improved UI on embedded pages (#10)
- Fixed issue preventing Administrators from viewing Views
- Fixed issue with selecting Azure Groups to sync not always saving

---

# Version 1.0.4
## What's Fixed?
- Issue where you are unable to search for Azure Groups, where there are more than 100 groups
- Issue causing only the first 100 members of an Azure Group to be synced

---

# Version 1.0.3
## What's Changed?
- Speed improvements
- Security improvements
- UI improvements

---

# Version 1.0.2
## What's New?
- Staff Directory is now Mobile Friendly!
- Views can now be set to allow guest access (filters and other items are hidden)

## What's Fixed?
- Setting who can see a view now actually prevents access to people without permission
- Consistancy across user "initials photos" where no photo is provided
- The default "All Staff" view now shows the leading text, selectors and sort by text
- Fixed mail notifications for creating new staff
- Fixed mail notifications when using the "Gray" WebApps theme

---

# Version 1.0.1
## What's New?
- Added option to upload photos to non-Azure synced users

## What's Fixed?
- Fixed photos for non-Azure synced users
- Fixed photos for Azure synced users
- Fixed opacity issue for users marked as On-Leave
- Fixed setting a Custom Field to unused now removes the field
- Fixed installation on Linux/macOS based web servers

---

# Version 1.0.0
- Initial Release