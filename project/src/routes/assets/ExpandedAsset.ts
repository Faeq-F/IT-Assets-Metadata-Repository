import { fetchDocumentByID } from "$lib/apiRequests";
import Update from '$lib/components/cards/auditTrail/Update.svelte';
import Add from '$lib/components/cards/auditTrail/Add.svelte';
import Remove from '$lib/components/cards/auditTrail/Remove.svelte';
import * as joint from 'jointjs';
import getRandomColor from "$lib/scripts/randomThemeColor";

let nodesList: any[] = [];

// this function is used to display each entry in the audit log for the asset
export	async function displayTrailComponent(
		type: string,
		key: string,
		value: string,
		oldValue: string | undefined
	) {
		if (('' + value).startsWith('DOCUMENT-ID: ')) {
			await fetchDocumentByID(value.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				value = '*Deleted item*';
				if (doc.assetName) value = doc.assetName;
				else if (doc.username) value = doc.username;
			});
		}
		if (oldValue != undefined && (oldValue + '').startsWith('DOCUMENT-ID: ')) {
			await fetchDocumentByID(oldValue.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				value = '*Deleted item*';
				if (doc.assetName) oldValue = doc.assetName;
				else if (doc.username) oldValue = doc.username;
			});
		}
		// this is the code for displaying the update component of the audit trail of the asset
		if (type == 'UPDATE') {
			new Update({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					newValue: value,
					oldValue: oldValue
				}
			});
			// this is the code for displaying the add component of the audit trail of the asset
		} else if (type == 'ADD') {
			new Add({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					newValue: value
				}
			});
			// this is the code for displaying the remove component of the audit trail of the asset
		} else {
			new Remove({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					value: value
				}
			});
		}
	}

  //function to create a node
		async function node(
			xPos: number,
			yPos: number,
      text: string,
      graph: joint.dia.Graph,
      cellStyle:joint.shapes.standard.Rectangle
		): Promise<joint.shapes.standard.Rectangle> {
			const node = cellStyle.clone();
			await fetchDocumentByID(text.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				let txt = 'Deleted item';
				if (doc.assetName != undefined) txt = doc.assetName;
				else if (doc.username != undefined) txt = doc.username;
				node.position(xPos, yPos);
				node.resize(txt.length * 12, 60);
				node.attr({
					body: {
						fill: getRandomColor(),
						rx: 20,
						ry: 20
					},
					label: {
						text: txt,
						extra: text,
						fill: '#000000',
						fontSize: 18,
						fontWeight: 'bold',
						textShadow: '1px 1px 1px black'
					}
				});
				node.addTo(graph);
			});

			return node;
		}

    		//function to create a link
		function link(
			node1: joint.shapes.standard.Rectangle,
			node2: joint.shapes.standard.Rectangle,
      label: string,
      graph:joint.dia.Graph
		) {
			const link = new joint.shapes.standard.Link();
			link.appendLabel({
				attrs: {
					text: {
						text: label
					}
				}
			});
			link.source(node1);
			link.target(node2);
			link.addTo(graph);
		}

    export async function addToGraph(
			root: joint.shapes.standard.Rectangle,
			metadataFields: any,
      yPos: number,
      originalX: number,
      graph: joint.dia.Graph
		) {
			let counter = 1;
			for (let [field, value] of Object.entries(metadataFields)) {
				if (typeof value === 'string' && value.startsWith('DOCUMENT-ID: ')) {
					if (counter % 2 == 0) originalX = originalX - counter * 200;
					else originalX = originalX + counter * 200;
					let newNode = await node(originalX, yPos + 170, value, graph, root);
					nodesList.push(newNode);
					link(root, newNode, field, graph);
					counter++;
				} else if (
					Array.isArray(value) &&
					value.length > 0 &&
					typeof value[0] === 'string' &&
					value[0].startsWith('DOCUMENT-ID: ')
				) {
					for (let doc of value) {
						if (counter % 2 == 0) originalX = originalX - counter * 200;
						else originalX = originalX + counter * 200;
						let newNode = await node(originalX, yPos + 170, doc, graph, root);
						nodesList.push(newNode);
						link(root, newNode, field, graph);
						counter++;
					}
				}
			}
		}


export function registerExpandingGraphHandler(paper:joint.dia.Paper, originalY:number, originalX:number, graph:joint.dia.Graph) {
      paper.on('cell:pointerclick', async function (cellView: any) {
			let nodeWanted: any;
			for (let i of nodesList) {
				if (i.attributes.attrs.label.extra == cellView.model.attributes.attrs.label.extra) {
					nodeWanted = i;
				}
			}
			if (nodeWanted) {
				await fetchDocumentByID(
					nodeWanted.attributes.attrs.label.extra.replace('DOCUMENT-ID: ', '')
				).then(async (doc) => {
					originalY = originalY + 100;
					if (doc.metadataFields)
						await addToGraph(nodeWanted, doc.metadataFields, originalY, originalX, graph);
				});
			}
			paper.scaleContentToFit({ padding: 10 });
		});
}

    export async function parseDiff(diff: any) {
		for (const item of diff) {
			if (item.changes && Array.isArray(item.changes)) {
				await parseChanges(item.changes);
			} else {
				await displayTrailComponent(item.type, item.key, item.value, item.oldValue);
			}
		}
	}

	async function parseChanges(changes: any) {
		for (const change of changes) {
			if (change.changes && Array.isArray(change.changes)) {
				await parseChanges(change.changes);
			} else {
				await displayTrailComponent(change.type, change.key, change.value, change.oldValue);
			}
		}
	}