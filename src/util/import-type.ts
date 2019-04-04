export function isAbsolute(name: string): boolean {
	return name.indexOf('/') === 0;
}

const moduleRegExp = /^\w/;
export function isModule(name: string): boolean {
	return moduleRegExp.test(name);
}

export function isRelativeToParent(name: string): boolean {
	return /^\.\.[\\/]/.test(name);
}

const indexFiles = ['.', './', './index', './index.js', './index.ts'];
export function isIndex(name: string): boolean {
	return indexFiles.indexOf(name) !== -1; // todo make this more flexible with different line endings
}

export function isRelativeToSibling(name: string): boolean {
	return /^\.[\\/]/.test(name);
}

export function isRegularExpressionGroup(group: string): boolean {
	return !!group && group[0] === '/' && group[group.length - 1] === '/' && group.length > 1;
}

export type KnownImportTypes = 'absolute' | 'module' | 'parent' | 'index' | 'sibling';
export type AllImportTypes = KnownImportTypes | 'unknown' | string;

export function determineImportType(
	name: string,
	regExpGroups: [string, RegExp][]
): AllImportTypes {
	const matchingRegExpGroup = regExpGroups.find(([_groupName, regExp]) => regExp.test(name));
	if (matchingRegExpGroup) return matchingRegExpGroup[0];

	if (isAbsolute(name)) return 'absolute';
	if (isModule(name)) return 'module';
	if (isRelativeToParent(name)) return 'parent';
	if (isIndex(name)) return 'index';
	if (isRelativeToSibling(name)) return 'sibling';

	return 'unknown';
}
