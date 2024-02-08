<script>
	import { focusTrap } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<form action="" class="userForm" use:focusTrap={true}>
	<label for="username" class="label">
		<p>Choose a username:</p>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input
				type="text"
				id="username"
				name="username"
				placeholder="Enter Username..."
				data-focusindex="0"
				class="input w-96"
			/>
			<a href="/" title="Username already in use"
				><i class="fa-solid fa-circle-exclamation text-warniong-500 animate-pulse"></i></a
			>
		</div>
	</label>
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
		/>
	</label>
	<br />
	<label for="repeatPassword" class="label">
		<p>Repeat Password:</p>
		<input
			type="password"
			id="password"
			name="password"
			data-focusindex="1"
			class="input"
			placeholder="Enter Password again..."
		/>
	</label>
	<br />
	<a href="/">
		<button class="variant-filled-primary btn w-52">Back to login</button>
	</a>
	<a href="/register">
		<button class="variant-filled-primary btn w-52">Create account</button>
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
