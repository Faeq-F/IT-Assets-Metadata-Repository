<script>
	import { focusTrap } from '@skeletonlabs/skeleton';
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
	<a href="/home">
		<button class="variant-filled-primary btn w-52">Log in</button>
	</a>
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
