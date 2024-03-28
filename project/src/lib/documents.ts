/**
 * An interface describing the structure of a User document in the database
 * @author Thomas Appleby - zlac196@live.rhul.ac.uk
 */
export interface User {
	username: string;
	email: string;
	role: string;
	_id: string;
	passwordHash: number;
}
