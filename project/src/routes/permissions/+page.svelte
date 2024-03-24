<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fetchDocuments, updateDocument } from '$lib/apiRequests';
	import Cookies from 'js-cookie';
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	// Define an interface for user data structure
	interface User {
		username: string; // Add relevant user data fields
		email: string;
		role: string;
		_id: string;
		passwordHash: number;
	}

	let users: User[] = [];

	onMount(() => {
		if (browser) {
			if (Cookies.get('savedLogin-role') != 'admin') {
				window.location.href = '/profile';
			}
		}
	});

	onMount(async () => {
		try {
			const userDocuments = await fetchDocuments('User');
			users = userDocuments;
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	});

	function updateUserPermissions() {
		let selects = document.getElementsByTagName('SELECT');
		for (let i of selects) {
			fetchDocuments('User').then((userDocument) => {
				let user = userDocument.find(
					(user: { username: string }) =>
						user.username === (i as HTMLSelectElement).dataset.username
				);
				let password = user.passwordHash;
				let newUserObject = {
					username: (i as HTMLSelectElement).dataset.username,
					email: (i as HTMLSelectElement).dataset.email,
					role: (i as HTMLSelectElement).value,
					passwordHash: password
				};
				if (newUserObject.username == Cookies.get('savedLogin-username')) {
					Cookies.set('savedLogin-role', '' + newUserObject.role, { expires: 70 });
					Cookies.set('savedLogin-username', '' + newUserObject.username, { expires: 70 });
					Cookies.set('savedLogin-email', '' + newUserObject.email, { expires: 70 });
					Cookies.set('savedLogin-password', '' + newUserObject.passwordHash, { expires: 70 });
				}
				for (let i of userDocument) {
					if (i.username == newUserObject.username) {
						const data = new FormData();
						data.append('newData', JSON.stringify(newUserObject));
						updateDocument('User', i._id, data, data)
							.then((response) => {
								console.log(response);
								toastStore.trigger({
									message: 'Roles updated',
									background: 'variant-ghost-success',
									timeout: 3000
								});
							})
							.catch((error) => {
								console.error('Update user role error', error);
							});
					}
				}
			});
		}
	}
</script>

<svelte:head>
	<title>Permissions</title>
</svelte:head>
<a class="variant-filled-surface btn ml-4" href="/profile" rel="nonreffere"
	><i class="fa-solid fa-circle-arrow-left"></i>&nbsp;&nbsp;Back
</a>

<h1 class="h1">Manage Permissions</h1>
<div class="usersContainer" id="usersContainer">
	{#each users as user}
		<div class="card card-hover m-4 bg-modern-50 p-3.5 drop-shadow-md">
			<div class="h3 font-bold">{user.username}</div>
			<div class="h4">{user.email}</div>
			<br />
			<select
				class="select"
				value={user.role}
				data-username={user.username}
				data-email={user.email}
				data-id={user._id}
				data-passwordHash={'' + user.passwordHash}
			>
				<option>admin</option>
				<option>normal</option>
				<option>viewer</option>
			</select>
		</div>
	{/each}
</div>
<button id="updatePermissions" class="variant-filled-primary btn" on:click={updateUserPermissions}
	>Update user permissions</button
>

<style>
	#updatePermissions {
		position: absolute;
		bottom: 5%;
		left: 50%;
		transform: translate(-50%, 0%);
	}
	.usersContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>
