# Team Project
Created during the 2023-2024 CS2815 module 'Team Project' at Royal Holloway, University of London.<br>
The intellectual property of the project idea belongs to our customer, Giorgios Koutsoukos.<br>
The specification for the project was provided externally through our customer.<br>

## Setup project locally

- install node.js (Tick the option for installing necessary tools)
- clone this repository
- cd into project folder
- run 'npm install'

## Run project locally

- ensure your local .env file has the correct credentials
- run 'npm run build'
- run 'node ./src/lib/api.cjs' to start the database server
- run 'npm run preview' to see the deliverable application (run in a different thread / terminal)

## Development

- ensure your local .env file has the correct credentials

- run 'npm run check' to type-check components with TypeScript

- run 'node ./src/lib/api.cjs' to start the database server

- run 'npm run dev' to run the project with live-reload and error messaging

- run 'npm run test' to run all unit tests and integration tests

- run 'npm run lint' to check for code style issues

- run 'npm run format' to format all of the code in the project, so that it conforms to the style wished for by the above command.

- run 'npm run coverage' to get a coverage report for unit tests

- run 'npm run doc' to generate the API documentation site (generated in the 'out' folder)

### Requirements

- Official VS Code Svelte extension
- add `"[svelte]": {"editor.defaultFormatter": "svelte.svelte-vscode"}` to VS Code settings file.

### Suggestions

- use the [fontawesome site (free section)](https://fontawesome.com/search?o=r&m=free) to find icons - has many icons that you can immediately copy and paste the tags for
- read the 'Skeleton' [UI Library's documentation](https://www.skeleton.dev/docs/introduction) while developing the site - has many components that you can immediately import and use
- use a cheat sheet for Tailwind CSS - [I use this one](https://flowbite.com/tools/tailwind-cheat-sheet/) - helps with knowing what certain classes are equivalent to
- install the 'Tailwind CSS IntelliSense' extension for VS Code - IntelliSense for Tailwind
- install the 'Document This' extension for VS Code - Automatically generates detailed JSDoc comments
- install the 'Simple Hide Files' extension for VS Code - Hides files that you do not need to look at from the explorer pane
- have the local server running while writing code - it can provide further insights into errors
