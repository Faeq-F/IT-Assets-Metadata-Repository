import { fetchDocuments } from '../api/apiRequests';
import { Form } from 'svelte-use-form';

export function hashCode(string: string) {
	var hashVal = 0;
	for (var i = 0; i < string.length; i++) {
		var unicode = string.charCodeAt(i);
		hashVal = (hashVal << 5) - hashVal + unicode;
		// Convert to a 32-bit integer
		hashVal = hashVal & hashVal;
	}
	return hashVal;
}

export function checkPasswordsMatch(value: string, form: Form<string>) {
	if (hashCode(value) !== hashCode(form.values.password)) {
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

export function duplicateUsername(username: string): Promise<boolean> {
	return fetchDocuments('User').then((documentsReturned) => {
		for (let i of documentsReturned) {
			if (i.username == username) {
				return true;
			}
		}
		return false;
	});
}
