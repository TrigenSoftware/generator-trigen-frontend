import 'babel-polyfill';<% if (projectType == 'reactjs') { %>
import React from 'react';
import ReactDOM from 'react-dom';
import Clicker from './clicker/clicker';<% if (gulpTasks.includes('offline')) { %>
import registerServiceWorker from './sw';<% if (webpackLoaders.includes('sass')) { %>
import './critical.scss';
import './content.scss';
import './footer.scss';<% } %>

registerServiceWorker({ scope: '/' }).catch((err) => {
	console.error(err); // eslint-disable-line
});<% } %>

ReactDOM.render(
	<Clicker/>,
	document.querySelector('#view')
);
<% } else { %>
import { increase } from './clicker/clicker';<% if (gulpTasks.includes('offline')) { %>
import registerServiceWorker from './sw';<% if (webpackLoaders.includes('sass')) { %>
import './critical.scss';
import './content.scss';
import './footer.scss';<% } %>

registerServiceWorker({ scope: '/' }).catch((err) => {
	console.error(err); // eslint-disable-line
});<% } %>

document.querySelector('header').addEventListener('click', () => {
	document.querySelector('header h1').innerText = increase();
});
<% } %>