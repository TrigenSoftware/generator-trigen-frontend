import 'babel-polyfill';
import React from 'react';
import {
	configure,
	addDecorator,
	setAddon
} from '@storybook/react';
import infoAddon from '@storybook/addon-info';

setAddon(infoAddon);

addDecorator(story => (
	<div style={{ padding: '12px' }}>
		{story()}
	</div>
));

const stories = require.context(
	'../src/app',
	true,
	/\.stories\.js$/
);

function loadStories() {
	stories.keys().forEach(filename =>
		stories(filename)
	);
}

configure(loadStories, module);
