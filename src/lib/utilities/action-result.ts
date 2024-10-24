export interface EarnItActionResult {
	success: boolean;
	message?: string;
	data?: unknown;
}

function success(message?: string): EarnItActionResult {
	return { success: true, message };
}

function successWithData(message?: string, data?: unknown): EarnItActionResult {
	return { success: true, message, data };
}

function fail(message?: string): EarnItActionResult {
	return { success: false, message };
}

export const ActionResponse = {
	success,
	successWithData,
	fail
};
