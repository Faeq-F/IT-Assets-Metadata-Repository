# Changelog

All notable changes to this project will be documented in this file.

## [Sprint 4] - 2024-03-14

### Added

- Graphs on the home page
  - A graph to show the number of assets created for each asset type
  - A graph to show the top 20, most associated assets
- Associations between assets
- A graph in the expanded view to show asset associations
  - ability to click on an asset associated to view its associations
- Audit trails in the expanded view, to show changes to an asset over time
- Share button on Assets, Asset Types and Users
- Warning prompt on account deletion
- List view for Assets & Asset Types
- Loading spinners & animated placeholder elements

### Fixed

- Update Role permissions page to actually update user roles
- Dark mode on assets search bar

### Changed

- Input for creating lists; now tokenized
- 'Make Asset' modal to indicate required fields
- 'Update Asset' modal to allow for updates to lists

### Security

- No changes.

### Deprecated

- Nothing.

### Removed

- Nothing.

## [Sprint 3] - 2024-02-29

### Added

- Asset and Asset Type counters on home page
- Expanded view for Assets and Asset Types
- Ability to update Assets and Asset Types, including all metadata fields
- Filtering assets by their type
- Manage user permissions page for admins (though not completely functional yet)
- Update account details modal (for updating username & password)

### Fixed

- Dark-mode on all UI components.
- Creation of a user using an email that already has an account

### Changed

- Made asset links clickable
- Search by keyword to be tokenized
  - keywords highlighted are across all possible matches, instead of just the first
- Moved make Asset and make Asset Type popups to modals
- Grid layout for assets and types
- Moved delete button for asset types to popup menu
- Some styles

### Security

- Fixed form submissions changing page URL.

### Deprecated

- Nothing.

### Removed

- Some styles.

## [Sprint 2] - 2024-02-15

### Added

- Login Page
  - able to log in to the app
  - can only access app through log-in
- Register Page
  - able to register for an account on the app
  - username uniqueness & validity checks
  - email validity check
  - password strength checks
- Search for Assets by Keyword
  - includes keyword highlighting
- Asset types
  - Ability to delete asset types
  - Specify the data type a metadata field is to hold
- Profile Page
  - button for logout account
  - button for delete account

### Fixed

- Nothing.

### Changed

- Short description on home page
- UI design with dark mode & following accessability guidelines
- How to add metadata fields to an asset type - UI
- Profile page to show username, log-out and delete account buttons

### Security

- Log-in cookies expire after 70 days.
- All passwords are hashed before they are saved / checked.
- URL manipulation attack mitigated.

### Deprecated

- Nothing.

### Removed

- Some styles.

## [Sprint 1] - 2024-02-01

### Added

- Login Page (non-functional)
- Home Page (non-functional)
- Assets Page
  - ability to create an asset from a type
- Asset Types Page
  - ability to create an asset type
  - able to specify metadata fields for a type
- Profile Page (non-functional)

### Fixed

- Nothing.

### Changed

- Nothing.

### Security

- No changes.

### Deprecated

- Nothing.

### Removed

- Nothing.

[Sprint 1]: https://gitlab.cim.rhul.ac.uk/TeamProject03/TeamProject03/-/tags/Sprint-1
[Sprint 2]: https://gitlab.cim.rhul.ac.uk/TeamProject03/TeamProject03/-/tags/Sprint-2
[Sprint 3]: https://gitlab.cim.rhul.ac.uk/TeamProject03/TeamProject03/-/tags/Sprint-3
[Sprint 4]: https://gitlab.cim.rhul.ac.uk/TeamProject03/TeamProject03/-/tags/Sprint-4
