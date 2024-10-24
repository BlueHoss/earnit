async function getAllUrlParams(url: string): Promise<object> {
	let paramsObj = {};
	try {
		url = url?.slice(1); //remove leading ?
		if (!url) return {}; //if no params return
		paramsObj = await Object.fromEntries(await new URLSearchParams(url));
	} catch (error) {
		console.log('error: ', error);
	}
	return paramsObj;
}

async function parseMessage(message: unknown): Promise<object> {
	let messageObj = {};
	try {
		if (message) {
			if (typeof message === 'string') {
				messageObj = { message: message };
			} else {
				messageObj = message;
			}
		}
	} catch (error) {
		console.log('error: ', error);
	}
	return messageObj;
}

async function parseTrack(track: unknown): Promise<object> {
	let trackObj = {};
	try {
		if (track) {
			if (typeof track === 'string') {
				trackObj = { track: track };
			} else {
				trackObj = track;
			}
		}
	} catch (error) {
		console.log('error: ', error);
	}
	return trackObj;
}

export const LogHelpers = {
	getAllUrlParams,
	parseMessage,
	parseTrack
};
