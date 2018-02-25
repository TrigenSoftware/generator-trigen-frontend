/**
 * SVG-icon component.
 */

import React, { PureComponent } from 'react';

const headBase = typeof document != 'undefined'
	? document.querySelector('head > base')
	: null;

const shoudlPrepandPathname = headBase && headBase.hasAttribute('href');

export default class Icon extends PureComponent {

	static defaultProps = {
		glyph: ''
	};

	hrefListenerRemover = null;

	render() {

		const {
			className,
			glyph,
			width,
			height,
			...props
		} = this.props;

		return (
			<svg
				className={`${className ? `${className} ` : ''}icon icon--${glyph}`}
				style={{ width, height }}
				{...props}
			>
				<use xlinkHref={`${this.getPathname()}#${glyph}`}/>
			</svg>
		);
	}

	componentDidMount() {

		if (shoudlPrepandPathname) {
			this.hrefListenerRemover = addHrefListener(() => {
				this.forceUpdate();
			});
		}
	}

	componentWillUnmount() {

		const { hrefListenerRemover } = this;

		if (shoudlPrepandPathname
			&& typeof hrefListenerRemover == 'function'
		) {
			hrefListenerRemover();
		}
	}

	// https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2
	getPathname() {

		if (shoudlPrepandPathname) {
			return `${location.pathname}${location.search}`;
		}

		return '';
	}
}

const hrefListeners = [];

function addHrefListener(listener) {

	hrefListeners.push(listener);

	return () => {
		hrefListeners.splice(
			hrefListeners.indexOf(listener),
			1
		);
	};
}

let prevHref = location.href;

setInterval(() => {

	if (prevHref != location.href) {
		prevHref = location.href;
		hrefListeners.forEach((listener) => {
			listener();
		});
	}

}, 1500);
