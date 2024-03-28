<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fetchDocuments, updateDocument } from '$lib/apiRequests';
	import Cookies from 'js-cookie';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { type User } from '$lib/documents';
	import { updateUserPermissions } from './permissions';
	const toastStore = getToastStore();

	let users: User[] = [];

	/*
	 * this will prevent access if the user is not an admin
	 */
	onMount(() => {
		if (browser) {
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
		<div class="card card-hover bg-modern-50 m-4 p-3.5 drop-shadow-md">
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
<button
	id="updatePermissions"
	class="variant-filled-primary btn"
	on:click={() => updateUserPermissions(toastStore)}>Update user permissions</button
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
