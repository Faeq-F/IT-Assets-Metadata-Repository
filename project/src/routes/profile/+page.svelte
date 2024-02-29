<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	import { deleteDocument, fetchDocuments } from '../api/apiRequests';
	import UpdateAccount from './updateAccount.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: UpdateAccount };
	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

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
		Cookies.remove('savedLogin-role');
		redirectWhenNotLoggedIn();
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1 class="h1">Your account</h1>
<br /><br />
<div id="profile" class="card m-7 h-1/2 w-11/12 bg-modern-50 text-center shadow-md">
	<br />
	<h3 class="h3 text-center">Username: {Cookies.get('savedLogin-username')}</h3>
	<h3 class="h4 inline text-center">Role: {Cookies.get('savedLogin-role')}</h3>
	{#if Cookies.get('savedLogin-role') == 'admin'}
		<a
			class="variant-filled-primary btn btn-sm inline w-52 text-sm"
			href="/permissions"
			rel="noreferrer"
		>
			Manage user permissions
		</a>
	{/if}
	<br />
	<br />
	<button class="variant-filled-primary btn w-52" on:click={() => modalStore.trigger(modal)}
		>Update Account details</button
	>
	<br />
	<br />

	<div id="accountButtonGroup">
		<button class="variant-filled-primary btn w-52" on:click={logOut}>Logout</button>
		<br /><br />
		<button class="variant-filled-primary btn w-52" on:click={deleteAccount}>Delete Account</button>
		<br /><br />
	</div>
</div>

<style>
	#profile {
		position: relative;
		margin: 0 auto;
	}
	#accountButtonGroup {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translate(-50%, 0%);
	}
</style>
