
<svelte:head>
	<title>Login</title>
</svelte:head>

<form action="" class="userForm">
	<label for="username" class="formLabel">Username:</label>
	<input type="text" id="username" name="username" /><br /><br />
	<label for="password" class="formLabel">Password:</label>
	<input type="text" id="password" name="password" /><br /><br />
	<a href="/home">
		<button class="gradientButton submitButton">
			<span class="text">Log in</span>
		</button>
	</a>
</form>

<style>
	@import url('$lib/styles/root.css');

	.userForm {
		margin: 0;
		padding: 0;
		/** Center the form */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.submitButton {
		margin: 0 auto;
		font-size: 1.3em;
		width: 100%;
	}

	.formLabel {
		font-size: 1.3em;
	}

	/**
		reuse button style from faeqs site
		maybe make gradient buttons a seperate component and then nest it in this page
		@import url('$lib/styles/gradientButtons.css');
	*/
	.gradientButton {
	}
</style>
