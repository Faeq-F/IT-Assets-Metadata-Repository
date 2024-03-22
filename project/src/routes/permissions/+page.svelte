<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fetchDocuments, updateDocument } from '$lib/apiRequests';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
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

	/*
	  this will redirect the user to the login page if
	  the user tries to access this page before logging in
	  if the user is saved as an admin then they are
	  redirected to the profile page
	*/
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
			// retrieves documents from the database from the User collection
			const userDocuments = await fetchDocuments('User');
			// assigns the fetched documents to the variable 'users'
			users = userDocuments;
		} catch (error) {
			// if an error occurs during fetching it will log the error to the console
			console.error('Error fetching users:', error);
		}
	});

	function updateUserPermissions() {
		// gets all select elements on the document
		let selects = document.getElementsByTagName('SELECT');
		// loops through each select element
		for (let i of selects) {
			// fetches the User collection document
			fetchDocuments('User').then((userDocument) => {
				// find the user whose username matches the username in the current select element
				let user = userDocument.find(
					(user: { username: string }) =>
						user.username === (i as HTMLSelectElement).dataset.username
				);
				// get the user's password hash
				let password = user.passwordHash;
				// create a new user object with the new role
				let newUserObject = {
					username: (i as HTMLSelectElement).dataset.username,
					email: (i as HTMLSelectElement).dataset.email,
					role: (i as HTMLSelectElement).value,
					passwordHash: password
				};
				// update saved cookies if the current user is being updated
				if (newUserObject.username == Cookies.get('savedLogin-username')) {
					// update the role, username, email, and password hash in cookies
					Cookies.set('savedLogin-role', '' + newUserObject.role, { expires: 70 });
					Cookies.set('savedLogin-username', '' + newUserObject.username, { expires: 70 });
					Cookies.set('savedLogin-email', '' + newUserObject.email, { expires: 70 });
					Cookies.set('savedLogin-password', '' + newUserObject.passwordHash, { expires: 70 });
				}
				// loop through each user in the document
				for (let i of userDocument) {
					/* 
					  if the username in the document matches the username of the new user object
					  update user document with the new role
					*/
					if (i.username == newUserObject.username) {
						// create new FormData to send updated data
						const data = new FormData();
						data.append('newData', JSON.stringify(newUserObject));
						// update the User collection with the new data
						updateDocument('User', i._id, data)
							.then((response) => {
								// log response and trigger a notification for successful role change
								console.log(response);
								toastStore.trigger({
									message: 'Roles updated',
									background: 'variant-ghost-success',
									timeout: 3000
								});
							})
							.catch((error) => {
								// log error if update fails
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
	<!--iterate over each user-->
	{#each users as user}
		<!--display user information within a card-->
		<div class="card card-hover m-4 bg-modern-50 p-3.5 drop-shadow-md">
			<!--display username-->
			<div class="h3 font-bold">{user.username}</div>
			<!--display email-->
			<div class="h4">{user.email}</div>
			<br />
			<!--set the value of the select elemt to the user's role and store username, email, id, and passwordhash in data attribute-->
			<select
				class="select"
				value={user.role}	
				data-username={user.username}
				data-email={user.email}
				data-id={user._id}
				data-passwordHash={'' + user.passwordHash}
			>
				<!--select dropdown for user roles with options admin, normal, and viewer-->
				<option>admin</option>
				<option>normal</option>
				<option>viewer</option>
			</select>
		</div>
	{/each}
</div>
<!--this code creates a button that is used to save the changed made to user permissions to the database-->
<button id="updatePermissions" class="variant-filled-primary btn" on:click={updateUserPermissions}
	>Update user permissions</button
>
<!--this is where the styling is stored-->
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
