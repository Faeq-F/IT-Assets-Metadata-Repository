import { updateDocument } from '$lib/apiRequests';
import type { ModalSettings, ModalStore, ToastStore } from '@skeletonlabs/skeleton';

/**
 * Deletes a container from the discussion board in the database
 * @param board The board the container belongs to
 * @param container The container to delete
 * @param toastStore The apps ToastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function deleteContainer(board: any, container: any, toastStore: any) {
	const data = new FormData();
	data.append(
		'newData',
		JSON.stringify({
			BoardCreator: board.BoardCreator,
			BoardName: board.BoardName,
			Containers: board.Containers.filter((containerCurr: any) => containerCurr != container),
			Description: board.Description,
			Messages: board.Messages
		})
	);
	updateDocument('DisscussionBoards', board._id, data).then((response) => {
		console.log(response);
		toastStore.trigger({
			message: 'Container deleted',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		location.reload();
	});
}

/**
 * Constructs a container object and saves it to the discussion board in the database
 * @param name The name of the container
 * @param description The description of the container
 * @param type The type of associations the container holds
 * @param modalStore The apps ModalStore
 * @param $modalStore The apps ModalStore
 * @param toastStore The apps ToastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function makeContainer(
	name: string,
	description: string,
	type: string,
	modalStore: ModalStore,
	$modalStore: ModalSettings[],
	toastStore: ToastStore
) {
	if (name && description && type) {
		//get the values
		let values: any[] = [];
		let input = document.getElementById('values')?.getElementsByTagName('input');
		if (input && input[0]) {
			let key = input[0].id.replace('-association', '').replace('-InputList', '');
			let item = document.getElementById(key + '-associationCollector')?.getElementsByTagName('LI');
			if (item) {
				let newArr = [];
				for (let j of item) {
					let object = (j as HTMLElement).dataset.associatedobject;
					if (object) newArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
				}
				values = newArr;
			}
		}
		//add it to the list of containers
		$modalStore[0].meta.boardDoc.Containers.push({
			ContainerName: name,
			ContainerDescription: description,
			ContainerType: type,
			ContainerValues: values
		});
		//construct the final obj
		const data = new FormData();
		data.append(
			'newData',
			JSON.stringify({
				BoardCreator: $modalStore[0].meta.boardDoc.BoardCreator,
				BoardName: $modalStore[0].meta.boardDoc.BoardName,
				Containers: $modalStore[0].meta.boardDoc.Containers,
				Description: $modalStore[0].meta.boardDoc.Description,
				Messages: $modalStore[0].meta.boardDoc.Messages
			})
		);
		updateDocument('DisscussionBoards', $modalStore[0].meta.boardDoc._id, data).then((response) => {
			console.log(response);
			toastStore.trigger({
				message: 'Container created',
				background: 'variant-ghost-success',
				timeout: 3000
			});
			// Refresh the page
			location.reload();
			modalStore.close();
		});
	} else {
		toastStore.trigger({
			message: 'Please fill in all of the fields',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	}
}

/**
 * Reconstructs the container object and saves it to the discussion board in the database
 * @param name The name of the container
 * @param description The description of the container
 * @param toastStore The apps ToastStore
 * @param modalStore The apps ModalStore
 * @param $modalStore The apps ModalStore
 */
export async function updateContainer(
	name: string,
	description: string,
	toastStore: ToastStore,
	modalStore: ModalStore,
	$modalStore: ModalSettings[]
) {
	let containers = $modalStore[0].meta.boardDoc.Containers.filter(
		(containerCurr: any) => containerCurr != $modalStore[0].meta.container
	);
	if (name && description) {
		//get the values
		let values: any[] = [];
		let input = document.getElementById('values')?.getElementsByTagName('input');
		if (input && input[0]) {
			let key = input[0].id.replace('-association', '').replace('-InputList', '');
			let item = document.getElementById(key + '-associationCollector')?.getElementsByTagName('LI');
			if (item) {
				let newArr = [];
				for (let j of item) {
					let object = (j as HTMLElement).dataset.associatedobject;
					if (object) newArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
				}
				values = newArr;
			}
		}
		//add it to the list of containers
		containers.push({
			ContainerName: name,
			ContainerDescription: description,
			ContainerType: $modalStore[0].meta.container.ContainerType,
			ContainerValues: values
		});
		//construct the final obj
		const data = new FormData();
		data.append(
			'newData',
			JSON.stringify({
				BoardCreator: $modalStore[0].meta.boardDoc.BoardCreator,
				BoardName: $modalStore[0].meta.boardDoc.BoardName,
				Containers: containers,
				Description: $modalStore[0].meta.boardDoc.Description,
				Messages: $modalStore[0].meta.boardDoc.Messages
			})
		);
		updateDocument('DisscussionBoards', $modalStore[0].meta.boardDoc._id, data).then((response) => {
			console.log(response);
			toastStore.trigger({
				message: 'Container Updated',
				background: 'variant-ghost-success',
				timeout: 3000
			});
			// Refresh the page
			location.reload();
			modalStore.close();
		});
	} else {
		toastStore.trigger({
			message: 'Please fill in all of the fields',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	}
}
