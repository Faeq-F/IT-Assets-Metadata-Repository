<script>
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { fetchDocuments } from './api/apiRequests';
	import { hashCode } from './register/validate';

	function loginUser() {
		fetchDocuments('User').then((userDocuments) => {
			// @ts-ignore
			let username = document.getElementById('username').value;
			// @ts-ignore
			let password = hashCode(document.getElementById('password').value);
			let user = userDocuments.find(
				(/** @type {{ username: any; }} */ user) => user.username === username
			);
			console.log(user);
			if (user && user.passwordHash === password) {
				window.location.href = '/home';
			} else {
				alert('Invalid username or password');
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
