export function checkPasswordsMatch(value: string, form) {
	if (value !== form.values.password) {
		return { checkPasswordsMatch: true };
	}
}

export function containNumbers(numbers: number) {
	return function (value: string) {
		if (value.replace(/[^0-9]/g, '').length < numbers) {
			return { containNumbers: numbers };
		}
	};
}
