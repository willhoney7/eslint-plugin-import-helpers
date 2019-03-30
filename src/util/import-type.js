const coreModules = require('builtin-modules/static');
const { join } = require('path');

const resolve = require('eslint-module-utils/resolve').default;

function baseModule(name) {
	if (isScoped(name)) {
		const [scope, pkg] = name.split('/');
		return `${scope}/${pkg}`;
	}
	const [pkg] = name.split('/');
	return pkg;
}

function isAbsolute(name) {
	return name.indexOf('/') === 0;
}

function isBuiltIn(name, settings) {
	const base = baseModule(name);
	const extras = (settings && settings['import/core-modules']) || [];
	return coreModules.indexOf(base) > -1 || extras.indexOf(base) > -1;
}

function isExternalPath(path, name, settings) {
	const folders = (settings && settings['import/external-module-folders']) || ['node_modules'];
	return !path || folders.some((folder) => -1 < path.indexOf(join(folder, name)));
}

const externalModuleRegExp = /^\w/;
function isExternalModule(name, settings, path) {
	return externalModuleRegExp.test(name) && isExternalPath(path, name, settings);
}

const externalModuleMainRegExp = /^[\w]((?!\/).)*$/;
function isExternalModuleMain(name, settings, path) {
	return externalModuleMainRegExp.test(name) && isExternalPath(path, name, settings);
}

const scopedRegExp = /^@[^/]+\/[^/]+/;
function isScoped(name) {
	return scopedRegExp.test(name);
}

const scopedMainRegExp = /^@[^/]+\/?[^/]+$/;
function isScopedMain(name) {
	return scopedMainRegExp.test(name);
}

function isInternalModule(name, settings, path) {
	return externalModuleRegExp.test(name) && !isExternalPath(path, name, settings);
}

function isRelativeToParent(name) {
	return /^\.\.[\\/]/.test(name);
}

const indexFiles = ['.', './', './index', './index.js'];
function isIndex(name) {
	return indexFiles.indexOf(name) !== -1;
}

function isRelativeToSibling(name) {
	return /^\.[\\/]/.test(name);
}

function isRegularExpressionGroup(group) {
	return group && group[0] === '/' && group[group.length - 1] === '/' && group.length > 1;
}

function resolveImportType(name, context, regExpGroups) {
	const matchingRegExpGroup = regExpGroups.find(([_groupName, regExp]) => regExp.test(name));
	if (matchingRegExpGroup) return matchingRegExpGroup[0];

	if (isAbsolute(name)) return 'absolute';
	if (isBuiltIn(name, context.settings)) return 'builtin';
	if (isExternalModule(name, context.settings, resolve(name, context))) return 'external';
	if (isScoped(name)) return 'external';
	if (isInternalModule(name, context.settings, resolve(name, context))) return 'internal';
	if (isRelativeToParent(name)) return 'parent';
	if (isIndex(name)) return 'index';
	if (isRelativeToSibling(name)) return 'sibling';

	return 'unknown';
}

module.exports = {
	isAbsolute,
	isBuiltIn,
	isExternalModuleMain,
	isRegularExpressionGroup,
	isScopedMain,
	resolveImportType
};
