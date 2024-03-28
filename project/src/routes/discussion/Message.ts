import { updateDocument } from '$lib/apiRequests';
import type { ToastStore } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';

/**
 * Constructs the message object and saves it to the discussion board in the database
 * @param boardDoc The discussion board the message is sent to
 * @param value The message
 * @param toastStore The apps ToastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function sendMessage(boardDoc: any, value: string, toastStore: ToastStore) {
	// formatting date
	let current = new Date();
	let day = current.getDate();
	let month = current.getMonth() + 1;
	let year = current.getFullYear();
	let current_date = `${day}/${month}/${year}`;
	let current_time = current.toLocaleTimeString();

	//add it to the list of messages
	boardDoc.Messages.push({
		Date: current_date,
		Time: current_time,
		Author: Cookies.get('savedLogin-username'),
		Message: value
	});

	//construct the final obj
	const data = new FormData();
	data.append(
		'newData',
		JSON.stringify({
			BoardCreator: boardDoc.BoardCreator,
			BoardName: boardDoc.BoardName,
			Containers: boardDoc.Containers,
			Description: boardDoc.Description,
			Messages: boardDoc.Messages
		})
	);
	updateDocument('DisscussionBoards', boardDoc._id, data).then((response) => {
		console.log(response);
		toastStore.trigger({
			message: 'Container created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		location.reload();
	});
}

/**
 * Adds text to the 'create message' area that corresponds to a quote of the message being replied to
 * @param Author The author of the message that is being replied to
 * @param Message The message being replied to
 * @param value The currently typed message (response)
 * @returns The message with the replied message appended to the top as a quote
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function reply(Author: string, Message: string, value: string): string {
	let valueToAssign: string = '> Replying to ' + Author + ':<br>\n';
	for (let i of Message.split('\n')) {
		valueToAssign += '>' + i + '\n';
	}
	valueToAssign += '\n\n' + value;
	value = valueToAssign;
	return value;
}

/**
 * Deletes a message from the discussion board in the database
 * @param boardDoc The discussion board to delete a message from
 * @param message The message to delete
 * @param toastStore The apps toastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function deleteMessage(boardDoc: any, message: any, toastStore: any) {
	const data = new FormData();
	data.append(
		'newData',
		JSON.stringify({
			BoardCreator: boardDoc.BoardCreator,
			BoardName: boardDoc.BoardName,
			Containers: boardDoc.Containers,
			Description: boardDoc.Description,
			Messages: boardDoc.Messages.filter((messageCurr: any) => messageCurr != message)
		})
	);
	updateDocument('DisscussionBoards', boardDoc._id, data).then((response) => {
		console.log(response);
		toastStore.trigger({
			message: 'Message deleted',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		location.reload();
	});
}
