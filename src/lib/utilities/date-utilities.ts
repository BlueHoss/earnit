export class DateUtility {
	static isUTC(date: Date): boolean {
		return date.getTimezoneOffset() === 0;
	}

	static toUTC(date: Date): Date {
		if (this.isUTC(date)) {
			return date;
		}

		return new Date(
			Date.UTC(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
				date.getMilliseconds()
			)
		);
	}

	static getUTCDayBounds(date: Date): { start: Date; end: Date } {
		const utcDate = this.toUTC(date);

		const start = new Date(
			Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), 0, 0, 0, 0)
		);

		const end = new Date(
			Date.UTC(
				utcDate.getUTCFullYear(),
				utcDate.getUTCMonth(),
				utcDate.getUTCDate(),
				23,
				59,
				59,
				999
			)
		);

		return { start, end };
	}

	static formatUTCDate(date: Date): string {
		const utcDate = this.toUTC(date);
		return utcDate.toISOString();
	}

	/**
	 * Sets the given date to the start of the day (00:00:00.000)
	 * @param date The date to modify
	 * @returns A new Date object set to the start of the day
	 */
	static setToStartOfDay(date: Date): Date {
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);
		return startOfDay;
	}

	static isDateString(dateString: string): boolean {
		const date = new Date(dateString);
		return !isNaN(date.getTime());
	}

	/**
	 * Sets the given date to the end of the day (23:59:59.999)
	 * @param date The date to modify
	 * @returns A new Date object set to the end of the day
	 */
	static setToEndOfDay(date: Date): Date {
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);
		return endOfDay;
	}
}

//   // Usage:
//   const date = new Date();

//   if (!DateUtility.isUTC(date)) {
// 	console.log('Converting to UTC...');
// 	date = DateUtility.toUTC(date);
//   }

//   // Get day bounds in UTC
//   const { start, end } = DateUtility.getUTCDayBounds(date);

//   // Format for display or database
//   const formattedDate = DateUtility.formatUTCDate(date);
