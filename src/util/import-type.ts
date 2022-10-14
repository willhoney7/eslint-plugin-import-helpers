export function isAbsolute(name: string): boolean {
	return name.indexOf('/') === 0;
}

// a module is anything that doesn't start with a . or a / or a \
const moduleRegExp = /^[^/\\.]/;
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

export type KnownImportType = 'absolute' | 'module' | 'parent' | 'index' | 'sibling' | 'type';
export type ValidImportType = KnownImportType | string; // this string should be a string surrounded with '/'
export type EveryImportType = ValidImportType | 'unknown';
export type RegExpGroups = [string, RegExp][]; // array of tuples of [string, RegExp]
export type ImportKind = 'value' | 'type';

export function determineImportType({
	name,
	regExpGroups,
	importKind,
	treatTypesAsGroup = false,
}: {
	name: string;
	regExpGroups: RegExpGroups;
	importKind: ImportKind;
	treatTypesAsGroup?: boolean;
}): EveryImportType {
	if (treatTypesAsGroup && importKind === 'type') return 'type';

	const matchingRegExpGroup = regExpGroups.find(([_groupName, regExp]) => regExp.test(name));
	if (matchingRegExpGroup) return matchingRegExpGroup[0];

	if (isAbsolute(name)) return 'absolute';
	if (isModule(name)) return 'module';
	if (isRelativeToParent(name)) return 'parent';
	if (isIndex(name)) return 'index';
	if (isRelativeToSibling(name)) return 'sibling';

	return 'unknown';
}
