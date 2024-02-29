<!-- <script lang="ts">
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
</script> -->

<script lang="ts">
    //@ts-ignore
    import { browser } from '$app/environment';
  
    import { onMount } from 'svelte';
    import { fetchDocuments } from '../api/apiRequests';
  
    // Define an interface for user data structure
    interface User {
      username: string; // Add relevant user data fields
    }
  
    let users: User[] = [];
  
    onMount(async () => {
      try {
        const userDocuments = await fetchDocuments('User');
        users = userDocuments;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    });
  </script>

<svelte:head>
    <title>Permissions</title>
</svelte:head>

<h1 class='h1'>Manage Permissions</h1>