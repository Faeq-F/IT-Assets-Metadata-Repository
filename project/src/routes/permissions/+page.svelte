<script lang="ts">
    //@ts-ignore
    import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { fetchDocuments } from '../api/apiRequests';
    import {
		AppBar,
		getModalStore,
		InputChip,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import Cookies from 'js-cookie';

    onMount(async() => {
        fetchDocuments('User').then((Users) => {
            CurrentUsers = Users;
        });
    });

    let CurrentUsers: any[];
</script>

<svelte:head>
    <title>Permissions</title>
</svelte:head>

<h1 class='h1'>Manage Permissions</h1>