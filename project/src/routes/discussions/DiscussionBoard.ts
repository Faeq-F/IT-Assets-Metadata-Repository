import { deleteDocument, insertDocument, updateDocument } from '$lib/apiRequests';
import type { ModalStore, ToastStore } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';

/**
 * Deletes a discussion board from the database
 * @param board The discussion board to delete
 * @param toastStore The apps toastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function deleteBoard(board: any, toastStore: ToastStore) {
	await deleteDocument('DisscussionBoards', board._id);
	toastStore.trigger({
		message: 'Discussion deleted',
		background: 'variant-ghost-success',
		timeout: 3000
	});
	// Refresh the page
	location.reload();
}
/**
 * Constructs a discussion board object and saves it in the database
 * @param boardName The name of the discussion board
 * @param description The description of the discussion board
 * @param toastStore The apps toastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function makeBoard(boardName: string, description: string, toastStore: ToastStore) {
	if (boardName && description) {
		const data = new FormData();
		data.append(
			'newData',
			JSON.stringify({
				BoardName: boardName,
				BoardCreator: Cookies.get('savedLogin-username'),
				Description: description,
				Messages: [],
				Containers: []
			})
		);
		await insertDocument('DisscussionBoards', data).then(async (response: any) => {
			toastStore.trigger({
				message: 'Discussion Board made',
				background: 'variant-ghost-success',
				timeout: 3000
			});
			console.log(response);
			//Refresh the page
			location.reload();
		});
	} else {
		toastStore.trigger({
			message: 'Please fill in all fields',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	}
}
/**
 * Reconstructs the discussion board object and saves it in the database
 * @param board The original discussion board object
 * @param boardName The name of the discussion board
 * @param description The discussion boards description
 * @param toastStore The apps toastStore
 * @param modalStore The apps modalStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function updateBoard(
	board: any,
	boardName: string,
	description: string,
	toastStore: ToastStore,
	modalStore: ModalStore
) {
	if (boardName && description) {
		const data = new FormData();
		data.append(
			'newData',
			JSON.stringify({
				BoardName: boardName,
				BoardCreator: board.BoardCreator,
				Description: description,
				Messages: board.Messages,
				Containers: board.Containers
			})
		);
		await updateDocument('DisscussionBoards', board._id, data).then(async (response: any) => {
			console.log(response);
			location.reload();
			modalStore.close();
		});
	} else {
		toastStore.trigger({
			message: 'Please fill in all fields',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	}
}
