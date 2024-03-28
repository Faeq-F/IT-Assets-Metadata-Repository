export { checkPasswordsMatch, containNumbers, duplicateUsername };
import { fetchDocuments } from '$lib/apiRequests';
import { Form } from 'svelte-use-form';

/**
 * Produces the hash of a string. Used for user passwords.
 * @param string the string to hash
 * @returns the hash; a negative integer
 * @author Alex Aleksandar - zlac205@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export function hashCode(string: string): number {
	var hashVal = 0;
	for (var i = 0; i < string.length; i++) {
		var unicode = string.charCodeAt(i);
		hashVal = (hashVal << 5) - hashVal + unicode;
		// Convert to a 32-bit integer
		hashVal = hashVal & hashVal;
	}
	return hashVal;
}

/**
 * Checks whether two passwords are the same
 * @param value The original password
 * @param form the form the user is typing the password in
 * @returns an object with an attribute representing whether the passwords match or not
 * @author Alex Aleksandar - zlac205@live.rhul.ac.uk
 */
function checkPasswordsMatch(
	value: string,
	form: Form<string>
): { checkPasswordsMatch: boolean } | undefined {
	if (hashCode(value) !== hashCode(form.values.password)) {
		return { checkPasswordsMatch: true };
	}
}

/**
 * Checks if a password contains numbers
 * @param numbers the number of numbers required
 * @returns a function that does the described functionality & returns an object with an attribute representing the number of numbers required
 * @author Alex Aleksandar - zlac205@live.rhul.ac.uk
 */
function containNumbers(numbers: number) {
	return function (value: string): { containNumbers: number } | undefined {
		if (value.replace(/[^0-9]/g, '').length < numbers) {
			return { containNumbers: numbers };
		}
	};
}

/**
 * Checks whether a username already exists
 * @param username the username to check for
 * @returns whether or not a user with that username already exists on the app
 * @author Shurjeel Mahmood - zltm723@live.rhul.ac.uk
 */
function duplicateUsername(username: string): Promise<boolean> {
	return fetchDocuments('User').then((documentsReturned) => {
		for (let i of documentsReturned) {
			if (i.username == username) {
				return true;
			}
		}
		return false;
	});
}

/**
 * Checks whether an email already exists
 * @param email the email to check for
 * @returns whether or not the email is already registered on the app
 * @author Shurjeel Mahmood - zltm723@live.rhul.ac.uk
 */
export function duplicateEmail(email: string): Promise<boolean> {
	return fetchDocuments('User').then((documentsReturned) => {
		for (let i of documentsReturned) {
			if (i.email == email) {
				return true;
			}
		}
		return false;
	});
}
