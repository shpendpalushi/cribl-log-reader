### Cribl Log Reader
Application structure:
- src - Where the functional part of the application is placed
-  tests - Where the tests for different components of the app are located.

For `src`:
- `controllers` - Contains the methods that get exposed as API endpoints
- `middleware` - Contains application level middlewares - error handling (if any other middleware would have been needed it would go here).
- `routes` - Router definitions for API endpoint methods defined in the `controllers`
- `services` - The place where the business logic happens. Either serves information for the API controllers or transforms it.
- `types` - Model definitions for different data types that might be needed in the application.
- `workers` - Background workers for parallelization, of processes that can be parallelized (log reading in this case).
- `app.ts` - Application construction file.
- `server.ts` - Starting point of the application.


For `tests`:
- `controllers` - Place where unit tests for controllers take place. More tests can be added, these are just for logic validation.
- `services` - Place where unit tests for services take place. More tests can be added, these are just for logic validation.

`.env` - The file for env variables
`package.json` - There are defined all running commands, such as application build, running, test running, dependencies, etc.

`jest.config.js` - Configuration file for Jest
`tsconfig.json` - Config file for TypeScript.

