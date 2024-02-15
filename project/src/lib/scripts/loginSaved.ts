import Cookies from 'js-cookie';
export function redirectWhenLoginSaved() {
	if (
		(Cookies.get('savedLogin-username') != undefined ||
			Cookies.get('savedLogin-email') != undefined) &&
		Cookies.get('savedLogin-password') != undefined
	) {
		window.location.href = '/home';
	}
}

export function redirectWhenNotLoggedIn() {
	if (
		(Cookies.get('savedLogin-username') == undefined ||
			Cookies.get('savedLogin-email') == undefined) &&
		Cookies.get('savedLogin-password') == undefined
	) {
		window.location.href = '/';
	}
}
