<script lang="ts">
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { fetchDocuments } from '$lib/apiRequests';
	import { hashCode } from './register/validate';
	import Cookies from 'js-cookie';
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { redirectWhenLoginSaved } from '$lib/scripts/loginSaved';
	redirectWhenLoginSaved();

	function loginUser() {
		fetchDocuments('User').then((userDocuments) => {
			let username = (document.getElementById('username') as HTMLInputElement).value;
			let password = hashCode((document.getElementById('password') as HTMLInputElement).value);
			let user = userDocuments.find((user: { username: string }) => user.username === username);
			if (user && user.passwordHash === password) {
				Cookies.set('savedLogin-username', username, { expires: 70 });
				Cookies.set('savedLogin-password', '' + user.passwordHash, { expires: 70 });
				Cookies.set('savedLogin-role', '' + user.role, { expires: 70 });
				window.location.href = '/home';
			} else {
				toastStore.trigger({
					message: 'Invalid username or password',
					background: 'variant-ghost-error',
					timeout: 3000
				});
			}
		});
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<form action="" class="userForm" use:focusTrap={true}>
	<label for="username" class="label">
		<p>Username:</p>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				type="text"
				id="username"
				name="username"
				placeholder="Enter Username..."
				data-focusindex="0"
				class="input w-96"
			/>
		</div>
	</label>
	<br />
	<label for="password" class="label">
		<p>Password:</p>
		<input
			type="password"
			id="password"
			name="password"
			data-focusindex="1"
			class="input"
			placeholder="Enter Password..."
		/>
	</label>
	<br />
	<button class="variant-filled-primary btn w-52" on:click={loginUser}>Log in</button>
	<a href="/register">
		<button class="variant-filled-primary btn w-52">Sign up</button>
	</a>
</form>

<style>
	.userForm {
		margin: 0;
		padding: 0;
		/** Center the form */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
