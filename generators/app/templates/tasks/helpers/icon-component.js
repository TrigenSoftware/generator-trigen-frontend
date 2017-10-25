/**
 * SVG-icon component.
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';

const headBase = typeof document != 'undefined'
	? document.querySelector('head > base')
	: null;

const shoudlPrepandPathname = headBase && headBase.hasAttribute('href');

export default class Icon extends PureComponent {

	static defaultProps = {
		glyph: ''
	};

	render() {

		const {
			className, glyph,
			width, height,
			...props
		} = this.props;

		return (
			<svg
				className={classNames(className, 'icon', `icon--${glyph}`)}
				style={{ width, height }}
				{...props}
			>
				<use xlinkHref={`${this.getPathname()}#${glyph}`}/>
			</svg>
		);
	}

	// https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2
	getPathname() {

		if (shoudlPrepandPathname) {
			return location.pathname;
		}

		return '';
	}
}
