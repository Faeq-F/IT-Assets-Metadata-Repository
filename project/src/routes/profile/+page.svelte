<script lang="ts">
	//@ts-ignore
	import { page } from '$app/stores'; //Does work

	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';
	import { fetchDocuments } from '$lib/apiRequests';
	import UpdateAccount from './updateAccount.svelte';
	import {
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import ExpandedUser from './ExpandedUser.svelte';
	import { deleteAccount, logOut } from './Account';
	const toastStore = getToastStore();

	let userDoc: any;
	let expandedUser: ModalComponent;
	let expandUser: ModalSettings;

	onMount(async () => {
		await fetchDocuments('User').then((Users) => {
			for (let i of Users) {
				if (i.username == Cookies.get('savedLogin-username')) {
					userDoc = i;
				}
			}
		});
		expandedUser = {
			ref: ExpandedUser,
			props: {
				id: userDoc._id,
				username: userDoc.username,
				email: userDoc.email,
				role: userDoc.role
			}
		};
		expandUser = {
			type: 'component',
			component: expandedUser,
			backdropClasses: '!p-0'
		};
	});

	const modalStore = getModalStore();
	const updateComponent: ModalComponent = { ref: UpdateAccount };
	const updateModal: ModalSettings = {
		type: 'component',
		component: updateComponent
	};
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<h1 class="h1">Your account</h1>
<br /><br />
<div id="profile" class="card m-7 h-1/2 w-11/12 bg-modern-50 text-center shadow-md">
	<!--this button creates a link which will allow the user to share their profile page-->
	<button
		class="variant-filled-surface btn btn-sm card-hover absolute right-2 top-2 m-1"
		on:click={() => {
			navigator.clipboard.writeText($page.url.origin + '/shared?user=' + userDoc._id);
			toastStore.trigger({
				message: 'Copied link',
				background: 'variant-ghost-success',
				timeout: 3000
			});
		}}
	>
		<span><i class="fa-solid fa-share-nodes"></i></span>
	</button>
	<br />
	<!--this creates the button which is used to open the expanded user page-->
	<h3 title="Username" class="h3 text-center">
		Username: <button on:click={() => modalStore.trigger(expandUser)}
			>{Cookies.get('savedLogin-username')}</button
		>
	</h3>
	<!--this displays the users Role and if they are an admin allows them to manage user permissions-->
	<h3 title="Role" class="h4 inline text-center">Role: {Cookies.get('savedLogin-role')}</h3>
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

	<!--Creates the button which opens up the update account details modal-->
	<button class="variant-filled-primary btn w-52" on:click={() => modalStore.trigger(updateModal)}
		>Update Account details</button
	>
	<br />
	<br />

	<!--this code creates the 2 buttons which are used to logout and delete account respectively-->
	<div id="accountButtonGroup">
		<button class="variant-filled-primary btn w-52" on:click={() => logOut()}>Logout</button>
		<br /><br />
		<button class="variant-filled-primary btn w-52" on:click={() => deleteAccount(toastStore)}
			>Delete Account</button
		>
		<br /><br />
	</div>
</div>

<!--this is where the styling is stored -->
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
