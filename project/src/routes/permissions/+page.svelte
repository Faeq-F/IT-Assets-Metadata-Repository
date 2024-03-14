<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment';

	import { onMount } from 'svelte';
	import { fetchDocuments, updateDocument } from '../api/apiRequests';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import Cookies from 'js-cookie';

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
			redirectWhenNotLoggedIn();
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
			let newUserObject = {
				username: (i as HTMLSelectElement).dataset.username,
				email: (i as HTMLSelectElement).dataset.email,
				role: (i as HTMLSelectElement).value,
				passwordHash: (i as HTMLSelectElement).dataset.passwordHash
			};
			console.log(newUserObject);
			
			fetchDocuments('User').then((Users) => {
				for (let i of Users) {
					if (i.username == newUserObject.username) {
						const data = new FormData();
						data.append('newData', JSON.stringify(newUserObject));

						updateDocument('User', i._id, data)
							.then((response) => {
								console.log(response);
							})
							.catch((error) => {
								console.error('Update user role error', error)
							})
						Cookies.set('savedLogin-role', '' + i.role, { expires:70 });
						Cookies.set('savedLogin-username', '' + newUserObject.username, { expires: 70});
						Cookies.set('savedLogin-email', '' + newUserObject.email, { expires: 70});
						Cookies.set('savedLogin-password', '' + newUserObject.passwordHash, { expires: 70});
					}
				}	
			});
		}
	}

</script>

<svelte:head>
	<title>Permissions</title>
</svelte:head>
<a class="variant-filled-primary btn" href="/profile" rel="nonreffere"> Back </a>

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
	>Update user permissions</button>


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
