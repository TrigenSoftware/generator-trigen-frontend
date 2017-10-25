/**
 * Generate React-component for SVG.
 */

import {
	stringifySymbol,
	stringify,
	generateImport,
	generateExport
} from 'svg-sprite-loader/lib/utils';
import { stringifyRequest } from 'loader-utils';
import { pascalize } from 'humps';
import path from 'path';

module.exports =
function runtimeGenerator({
	symbol, config,
	context, loaderContext
}) {

	const { spriteModule, symbolModule, runtimeOptions, esModule } = config,
		compilerContext   = loaderContext._compiler.context,
		iconModulePath    = path.resolve(compilerContext, runtimeOptions.iconModule),
		iconModuleRequest = stringify(
			path.relative(path.dirname(symbol.request.file), iconModulePath)
		),
		spriteRequest     = stringifyRequest({ context }, spriteModule),
		symbolRequest     = stringifyRequest({ context }, symbolModule),
		displayName       = `Icon${pascalize(symbol.id)}`;

	return `
		${generateImport('React', 'react', esModule)}
		${generateImport('SpriteSymbol', symbolRequest, esModule)}
		${generateImport('sprite', spriteRequest, esModule)}
		${generateImport(esModule ? 'Icon' : '{ default: Icon }', iconModuleRequest, esModule)}

		var symbol = new SpriteSymbol(${stringifySymbol(symbol)});
		sprite.add(symbol);

		function ${displayName}() {
			Reflect.apply(Icon, this, arguments);
		}

		${displayName}.prototype = Object.create(Icon.prototype);

		${displayName}.defaultProps = Object.assign(
			{},
			Icon.defaultProps,
			{ glyph: '${symbol.id}' }
		);

		${generateExport(displayName, esModule)}
	`;
};
