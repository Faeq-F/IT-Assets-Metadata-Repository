<script lang="ts">
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { useForm, Hint, HintGroup, validators, minLength, required } from 'svelte-use-form';
	import {
		checkPasswordsMatch,
		containNumbers,
		hashCode,
		duplicateUsername
	} from '../register/validate';
	import Cookies from 'js-cookie';
	//import { getToastStore } from '@skeletonlabs/skeleton';
	import { fetchDocuments, updateDocument } from '../api/apiRequests';

	//const toastStore = getToastStore();
	//redirectWhenLoginSaved();

	const form = useForm();
	const requiredMsg = 'This field is required';

	let usernameTaken = true;
	function checkValidUsername() {
		let username = (document.getElementById('username') as HTMLInputElement).value;
		duplicateUsername(username).then((taken) => (usernameTaken = taken));
	}

	function makeUpdate() {
		let newUsername = (document.getElementById('username') as HTMLInputElement).value;
		let newPass = (document.getElementById('passwordConfirmation') as HTMLInputElement).value;

		if (newUsername && newPass) {
			var newPassHash = hashCode(newPass);

			fetchDocuments('User').then((Users) => {
				for (let i of Users) {
					if (i.username == Cookies.get('savedLogin-username')) {
						var userObj = { username: newUsername, passwordHash: newPassHash };

						const data = new FormData();
						data.append('newData', JSON.stringify(userObj));

						updateDocument('User', i._id, data)
							.then((response) => {
								console.log(response);
							})
							.catch((error) => {
								console.error('Update user error: ', error);
							});
					}
				}
			});
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<form action="" class="userForm" use:focusTrap={true} use:form>
	<form action="" class="userForm" use:focusTrap={true} use:form>
		<label for="username" class="label">
			<p>Choose a new Username:</p>
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input
					type="text"
					id="username"
					name="username"
					placeholder="Enter new Username..."
					data-focusindex="1"
					class="input w-96"
					on:keyup={checkValidUsername}
					use:validators={[required, minLength(4)]}
				/>
				{#if usernameTaken}
					<a href="/" title="Username already in use or invalid">
						<i class="fa-solid fa-circle-exclamation text-warniong-500 animate-pulse"></i>
					</a>
				{:else}
					<a href="/" title="Valid username">
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
			<p>Choose a new Password:</p>
			<input
				type="password"
				id="password"
				name="password"
				data-focusindex="2"
				class="input"
				placeholder="Enter new Password..."
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

		<button class="variant-filled-primary btn w-52" disabled={!$form.valid} on:click={makeUpdate}>
			Update details</button
		>
	</form>
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
