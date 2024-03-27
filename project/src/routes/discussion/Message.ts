import { updateDocument } from "$lib/apiRequests";
import Cookies from 'js-cookie';

	export async function sendMessage(boardDoc: any, value:string, toastStore:any) {
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

	export function reply(Author: string, Message: string, value:string):string {
		let valueToAssign: string = '> Replying to ' + Author + ':<br>\n';
		for (let i of Message.split('\n')) {
			valueToAssign += '>' + i + '\n';
		}
		valueToAssign += '\n\n' + value;
    value = valueToAssign;
    return value
	}

	export function deleteMessage(boardDoc: any, message: any, toastStore:any) {
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