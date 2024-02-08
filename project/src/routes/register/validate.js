export function checkPasswordsMatch(value, form) {
	if (value !== form.values.password) {
		return { checkPasswordsMatch: true };
	}
}

export function containNumbers(numbers) {
	return function (value) {
		if (value.replace(/[^0-9]/g, '').length < numbers) {
			return { containNumbers: numbers };
		}
	};
}
