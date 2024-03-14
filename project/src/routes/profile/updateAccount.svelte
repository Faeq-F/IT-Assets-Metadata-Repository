<script lang="ts">
	import { focusTrap, getToastStore } from '@skeletonlabs/skeleton';
	import { useForm, Hint, HintGroup, validators, minLength, required } from 'svelte-use-form';
	import { checkPasswordsMatch, containNumbers, hashCode } from '$lib/scripts/validate';
	import Cookies from 'js-cookie';
	import { fetchDocuments, updateDocument } from '$lib/apiRequests';

	const toastStore = getToastStore();
	const form = useForm();
	const requiredMsg = 'This field is required';

	function duplicateUsername(username: string): Promise<boolean> {
		return fetchDocuments('User').then((documentsReturned) => {
			for (let i of documentsReturned) {
				// Return false if the username is unchanged (the same as the username stored in the cookie)
				if (username == Cookies.get('savedLogin-username')) {
					return false;
				} else if (i.username == username) {
					return true;
				}
			}
			return false;
		});
	}

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
						var userObj = {
							username: newUsername,
							passwordHash: newPassHash,
							role: Cookies.get('savedLogin-role'),
							email: i.email
						};

						const data = new FormData();
						data.append('newData', JSON.stringify(userObj));

						updateDocument('User', i._id, data)
							.then((response) => {
								// Update the cookies
								Cookies.set('savedLogin-username', newUsername, { expires: 70 });
								Cookies.set('savedLogin-password', '' + newPassHash, { expires: 70 });

								console.log(response);

								toastStore.trigger({
									message: 'Account updated',
									background: 'variant-ghost-success',
									timeout: 3000
								});

								// Refresh the page
								location.reload();
							})
							.catch((error) => {
								console.error('Update user error: ', error);

								toastStore.trigger({
									message: 'Error updating details',
									background: 'variant-ghost-error',
									timeout: 3000
								});
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
<div class="card p-5 shadow-xl" id="rootDiv">
	<div class="card h-full bg-modern-50 p-1">
		<h2 class="h2 mt-20 text-center">Update your details</h2>
		<p class="p mt-10 text-center">
			Note: If you want to leave a credential unchanged (i.e. keep the same username/password), you
			must enter your existing credential
		</p>
		<br /><br />
		<hr />
		<br />
		<form action="" class="userForm w-6/12 text-center" use:focusTrap={true} use:form>
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
							<a href="/profile" title="Username already in use or invalid">
								<i class="fa-solid fa-circle-exclamation animate-pulse text-warning-500"></i>
							</a>
						{:else}
							<a href="/profile" title="Valid username">
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

				<button
					class="variant-filled-primary btn w-52"
					disabled={!$form.valid}
					on:click|preventDefault={makeUpdate}
				>
					Update details</button
				>
			</form>
		</form>
	</div>
</div>

<style>
	:global(.touched:invalid) {
		border-color: red;
	}

	.userForm {
		margin: 0 auto;
		padding: 0;
	}

	#rootDiv {
		height: 78vh;
		width: 70vw;
	}
</style>
