<script lang="ts">
	import { focusTrap } from '@skeletonlabs/skeleton';
	import {
		useForm,
		Hint,
		HintGroup,
		validators,
		minLength,
		required,
		email
	} from 'svelte-use-form';
	import {
		checkPasswordsMatch,
		containNumbers,
		hashCode,
		duplicateUsername,
		duplicateEmail
	} from '../../lib/scripts/validateUserDetails';
	import { insertDocument } from '$lib/apiRequests';
	import Cookies from 'js-cookie';
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	const form = useForm();
	const requiredMsg = 'This field is required';

	let emailTaken = false;
	function checkValidEmail() {
		let email = (document.getElementById('email') as HTMLInputElement).value;
		duplicateEmail(email).then((taken) => (emailTaken = taken));
	}

	let usernameTaken = false;
	function checkValidUsername() {
		let username = (document.getElementById('username') as HTMLInputElement).value;
		duplicateUsername(username).then((taken) => (usernameTaken = taken));
	}

	/**
	 * Gets user information, verifies the data and sends it to User database if valid.
	 * @author .....
	 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
	 */
	function registerUser() {
		let username = (document.getElementById('username') as HTMLInputElement).value;
		let password = (document.getElementById('passwordConfirmation') as HTMLInputElement).value;
		let email = (document.getElementById('email') as HTMLInputElement).value;
		let role = 'viewer';

		if (username && password && email) {
			var passwordHash = hashCode(password);
			var userObj = { username: username, passwordHash: passwordHash, email: email, role: role };

			const data = new FormData();
			data.append('newData', JSON.stringify(userObj));

			insertDocument('User', data)
				.then((response) => {
					console.log(response);
					toastStore.trigger({
						message: 'Account created',
						background: 'variant-ghost-success',
						timeout: 3000
					});
					Cookies.set('savedLogin-username', username, { expires: 70 });
					Cookies.set('savedLogin-email', email, { expires: 70 });
					Cookies.set('savedLogin-password', '' + passwordHash, { expires: 70 });
					Cookies.set('savedLogin-role', '' + role, { expires: 70 });
					window.location.href = '../home';
				})
				.catch((error) => {
					console.error('Registering user error: ', error);
				});
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<form action="" class="userForm" use:focusTrap={true} use:form>
	<label for="email" class="label">
		<p>Email:</p>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				type="text"
				id="email"
				name="email"
				placeholder="Enter email..."
				data-focusindex="0"
				class="input w-96"
				on:keyup={checkValidEmail}
				use:validators={[required, email]}
			/>
			{#if emailTaken}
				<a href="/register" title="Email already in use or invalid">
					<i class="fa-solid fa-circle-exclamation text-warning-500 animate-pulse"></i>
				</a>
			{:else}
				<a href="/register" title="Valid email">
					<i class="fa-solid fa-check"></i>
				</a>
			{/if}
		</div>
	</label>

	<HintGroup for="email">
		<Hint on="required">{requiredMsg}</Hint>
		<Hint on="email" hideWhenRequired>Please enter a valid email</Hint>
	</HintGroup>

	<br />
	<label for="username" class="label">
		<p>Choose a Username:</p>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				type="text"
				id="username"
				name="username"
				placeholder="Enter Username..."
				data-focusindex="1"
				class="input w-96"
				on:keyup={checkValidUsername}
				use:validators={[required, minLength(4)]}
			/>
			{#if usernameTaken}
				<a href="/register" title="Username already in use or invalid">
					<i class="fa-solid fa-circle-exclamation text-warning-500 animate-pulse"></i>
				</a>
			{:else}
				<a href="/register" title="Valid username">
					<i class="fa-solid fa-check"></i>
				</a>
			{/if}
		</div>
	</label>

	<HintGroup for="username">
		<Hint on="required">{requiredMsg}</Hint>
		<Hint on="minLength" hideWhenRequired let:value
			>This field must have at least {value} characters.</Hint
		>
	</HintGroup>

	<br />
	<label for="password" class="label">
		<p>Choose a Password:</p>
		<input
			type="password"
			id="password"
			name="password"
			data-focusindex="2"
			class="input"
			placeholder="Enter Password..."
			use:validators={[required, minLength(8), containNumbers(2)]}
		/>
	</label>

	<HintGroup for="password">
		<Hint on="required">{requiredMsg}</Hint>
		<Hint on="minLength" hideWhenRequired let:value
			>This field must have at least {value} characters.</Hint
		>
		<Hint on="containNumbers" hideWhen="minLength" let:value>
			This field must contain at least {value} numbers.
		</Hint>
	</HintGroup>

	<br />
	<label for="passwordConfirmation" class="label">
		<p>Repeat Password:</p>
		<input
			type="password"
			id="passwordConfirmation"
			name="passwordConfirmation"
			data-focusindex="3"
			class="input"
			placeholder="Enter Password again..."
			use:validators={[required, checkPasswordsMatch]}
		/>
	</label>

	<HintGroup for="passwordConfirmation">
		<Hint on="required">{requiredMsg}</Hint>
		<Hint on="checkPasswordsMatch" hideWhenRequired>Passwords do not match</Hint>
	</HintGroup><br />

	<br />
	<a href="/">
		<button class="variant-filled-primary btn w-52">Back to login</button>
	</a>

	<button
		class="variant-filled-primary btn w-52"
		disabled={!$form.valid || emailTaken || usernameTaken}
		on:click|preventDefault={registerUser}
	>
		Create account</button
	>
</form>

<style>
	:global(.touched:invalid) {
		border-color: red;
	}

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
