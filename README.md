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

- `jest.config.js` - Configuration file for Jest
- `tsconfig.json` - Config file for TypeScript.

### How it works:

To start the application run for the root directory of the project `yarn` (or `npm i`) in the first place to have all the dependencies installed. 
Once you are done with that you can run `npm run dev-server` to test the application locally. 


`localhost:3000/api/logger?filename={YOUR_FILE_NAME}` you can do a HTTP GET request here with query params as specified in the task and you will be able to see the responses. 


Another implementation way provided in the solution:
`localhost:3000/api/logger/worker?filename={YOUR_FILE_NAME}`is can be tested under the given GET Endpoint. It makes use of service workers and parallelization to provide a "more efficient" solution. Remember you have to optimize the number of Workers used to gain in performance.


On the other hand for reading logs from remote machines:
``localhost:3000/api/remote-logger?filename={YOUR_FILE_NAME}`` GET endpoint is provided. Remember that to make use of it in the env file you have to specify the path for the Private Key of the machine. Didn't have a machine up for testing but in theory the implementation flow makes sense.
