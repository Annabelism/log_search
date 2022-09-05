
# Log Search Starter Project

This is an example application, which uses the core library of [Hookstate](https://github.com/avkonst/hookstate) to manage various types of states.

The app uses Hookstate which has [code samples and demos available online](https://hookstate.js.org/).

It uses some components from Material-UI which has [documentation on how to use it here](https://mui.com/material-ui/getting-started/overview/).

The log information is served from a demo elasticsearch index. 
The full elasticsearch search API can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### Local Development Note

This application uses npm version 16.15.1

Run Elasticsearch on your local machine before running npm

The application makes a call to an external API. This will cause a [CORS error](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors).
To get around this, there are [extensions](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) that can add headers to server responses to ignore these errors:

- `access-control-allow-origin: *`
- `access-control-allow-headers: content-type`

Both of these response headers are needed for this application to function.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
