<script lang="ts">
	//@ts-ignore
	import { fetchDocumentByID } from '$lib/apiRequests';
	import { onMount } from 'svelte';
	import ExpandedAsset from '../assets/ExpandedAsset.svelte';
	import ExpandedType from '../types/ExpandedType.svelte';
	import ExpandedUser from '../profile/ExpandedUser.svelte';

	let assetParam: string | null;
	let typeParam: string | null;
	let userParam: string | null;

	/**
	 * Gets the relevant shared document id from the url
	 * @author Faeq Faisal
	 * @email faeqfaisal@hotmail.co.uk
	 * @email zlac318@live.rhul.ac.uk
	 */
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		assetParam = urlParams.get('asset'); // if the shared document is an asset
		typeParam = urlParams.get('type'); // if the shared document is an asset type
		userParam = urlParams.get('user'); // if the shared document is a user
	});
</script>

<!--The style prop applies to the close button on the component.
	The Expanded-view component is normally used as a modal,
	but in this case, we want it as page content -->

{#if assetParam != null}
	{#await fetchDocumentByID(assetParam)}
		<p class="w-full text-center">Loading Asset {assetParam}</p>
	{:then assetDoc}
		<ExpandedAsset
			id={assetDoc._id}
			assetName={assetDoc.assetName}
			assetLink={assetDoc.assetLink}
			assetType={assetDoc.assetType}
			metadataFields={assetDoc.metadataFields}
			style="display:none;"
		/>
	{/await}
{:else if typeParam != null}
	{#await fetchDocumentByID(typeParam)}
		<p class="w-full text-center">Loading Asset Type {typeParam}</p>
	{:then typeDoc}
		<ExpandedType
			id={typeDoc._id}
			typeName={typeDoc.typeName}
			metadataFields={typeDoc.metadataFields}
			style="display:none;"
		/>
	{/await}
{:else if userParam != null}
	{#await fetchDocumentByID(userParam)}
		<p class="w-full text-center">Loading User {userParam}</p>
	{:then userDoc}
		<ExpandedUser
			id={userDoc._id}
			username={userDoc.username}
			role={userDoc.role}
			email={userDoc.email}
			style="display:none;"
		/>
	{/await}
{:else}
	<p class="w-full text-center">incorrect url format</p>
{/if}
