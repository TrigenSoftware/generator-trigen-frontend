import 'babel-polyfill';<% if (projectType == 'reactjs') { %>
import React from 'react';
import ReactDOM from 'react-dom';
import Clicker from './clicker/clicker';

ReactDOM.render(
	<Clicker/>,
	document.querySelector('#view')
);
<% } else { %>
import { increase } from './clicker/clicker';

document.querySelector('header').addEventListener('click', () => {
	document.querySelector('header h1').innerText = increase();
});
<% } %>