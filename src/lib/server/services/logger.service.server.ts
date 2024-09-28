import { Axiom } from '@axiomhq/js';
import { AXIOM_TOKEN, AXIOM_ORG_ID, AXIOM_DATASET } from '$env/static/private';
import type { User } from 'lucia';

export interface EarnItError {
	message: string;
	description: string;
	user: User | null;
	method: string | null;
	stackTrace: string | null;
	error: string | null;
}

async function handleError(
	error: unknown,
	description: string | null = null,
	method: string | null = null,
	user: User | null = null
) {
	const stack = error instanceof Error ? error.stack : 'Unknown stack';
	const log = {
		message: error instanceof Error ? error.message : 'Unknown error',
		description: description ? description : '',
		method: method ? method : '',
		user: user ? user : null,
		stackTrace: stack ? stack : 'Unknown stack',
		error: error instanceof Error ? error.toString() : null
	};
	ingestLog(log, 'error');
}

async function error(
	message: string,
	description: string = '',
	method: string = '',
	user: User | null = null
) {
	const log = {
		message: message ? message : 'Unknown error',
		description: description,
		method: method,
		user: user ? user : null,
		stackTrace: '',
		error: message ? message : 'Unknown error'
	};
	console.error(log);
	ingestLog(log, 'error');
}

async function info(message: string) {
	const log = {
		message: message ? message : 'Unknown info log',
		description: '',
		method: '',
		user: null,
		stackTrace: '',
		error: message ? message : 'Unknown info log'
	};
	console.log(log);
	ingestLog(log, 'info');
}

function ingestLog(log: EarnItError, level: string): object {
	const logData: object = {
		level: level,
		message: log.message,
		method: log.method ? log.method : '',
		user: log.user ? log.user.email : '',
		userId: log.user ? log.user.email : -1,
		errorStackTrace: log.stackTrace ? log.stackTrace : ''
	};

	const client = new Axiom({
		token: AXIOM_TOKEN,
		orgId: AXIOM_ORG_ID
	});
	client.ingest(AXIOM_DATASET, [logData]);

	return logData;
}

export const LoggerService = {
	error,
	info,
	handleError
};
