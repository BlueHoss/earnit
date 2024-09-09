export interface EarnItActionResult {
	success: boolean;
	message?: string;
}

function success(message?: string): EarnItActionResult {
	return { success: true, message };
}

function fail(message?: string): EarnItActionResult {
	return { success: false, message };
}

export const ActionResponse = {
	success,
	fail
};
