export function removeAllSpaces(text: string): string {
	return !text ? '' : text.replace(/\s/g, '');
}
