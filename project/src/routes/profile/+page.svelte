<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	import { deleteDocument, fetchDocuments } from '../api/apiRequests';
	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});

	function deleteAccount() {
		fetchDocuments('User').then((Users) => {
			for (let i of Users) {
				if (i.username == Cookies.get('savedLogin-username')) {
					deleteDocument('User', i._id).then(() => {
						logOut();
					});
				}
			}
		});
	}

	function logOut() {
		Cookies.remove('savedLogin-username');
		Cookies.remove('savedLogin-email');
		Cookies.remove('savedLogin-password');
		redirectWhenNotLoggedIn();
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1 class="h1">Your account</h1>
<br /><br />
<div id="profile" class="card bg-modern-50 m-7 h-1/2 shadow-md">
	<br />
	<h3 class="h3 text-center">Username: {Cookies.get('savedLogin-username')}</h3>
	<div id="accountButtonGroup">
		<button class="variant-filled-primary btn w-52" on:click={logOut}>Logout</button>
		<br /><br />
		<button class="variant-filled-primary btn w-52" on:click={deleteAccount}>Delete Account</button>
	</div>
</div>

<style>
	#profile {
		position: relative;
	}
	#accountButtonGroup {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translate(-50%, 0%);
	}
</style>
