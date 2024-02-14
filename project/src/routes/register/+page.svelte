<script>
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
	import { checkPasswordsMatch, containNumbers, hashCode, duplicateUsername } from './validate';
	import { insertDocument, fetchDocuments } from '../api/apiRequests';

	const form = useForm();
	const requiredMsg = 'This field is required';

	function registerUser() {
		// @ts-ignore
		let username = document.getElementById('username').value;
		
		fetchDocuments('User').then((documentsReturned) => {
			console.log(duplicateUsername(username, documentsReturned))
			console.log("Hi")
		});

		// @ts-ignore
		let password = document.getElementById('passwordConfirmation').value;
		// @ts-ignore
		let email = document.getElementById('email').value;
		if (username && password && email) {
			var passwordHash = hashCode(password);

			var userObj = { username: username, passwordHash: passwordHash, email: email };
			console.log(userObj);

			const data = new FormData();
			data.append('newData', JSON.stringify(userObj));

			insertDocument('User', data)
				.then((response) => {
					console.log(response);
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
				use:validators={[required, email]}
			/>
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
				data-focusindex="0"
				class="input w-96"
				use:validators={[required, minLength(4)]}
			/>
			<a href="/" title="Username already in use"
				><i class="fa-solid fa-circle-exclamation text-warniong-500 animate-pulse"></i></a
			>
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
			data-focusindex="1"
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
			data-focusindex="1"
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

	<button class="variant-filled-primary btn w-52" disabled={!$form.valid} on:click={registerUser}>
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
