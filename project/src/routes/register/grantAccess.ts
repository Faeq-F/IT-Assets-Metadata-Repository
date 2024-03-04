export { UserRole };

enum UserRole {
	Admin = 'admin',
	Viewer = 'viewer',
	User = 'user'
}

// // Return statements are placeholders
// function grantAccess(role: UserRole): string {
// 	switch (role) {
// 		case UserRole.Admin:
// 			return 'Admin level access granted. You can create, update, and delete assets types.';
// 		case UserRole.Viewer:
// 			return 'Viewer level access granted. You have read-only access.';
// 		case UserRole.User:
// 			return 'User level access granted. You can create, update, and delete specific assets.';
// 		default:
// 			return 'Invalid';
// 	}
// }
// function authoriseAssignRole(userRole: UserRole): boolean {
// 	return userRole === UserRole.Admin;
// }
