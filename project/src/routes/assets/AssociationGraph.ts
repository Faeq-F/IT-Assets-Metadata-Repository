import { fetchDocumentByID } from '$lib/apiRequests';
import * as joint from 'jointjs';
import getRandomColor from '$lib/scripts/randomThemeColor';

/**
 * A list of all nodes that have been created
 */
let nodesList: any[] = [];

/**
 * Creates and adds a node to the graph
 * @param id  The _id of the associated document the node corresponds to
 * @param xPos The x position of the node on the paper
 * @param yPos The y position of the node on the paper
 * @param cellStyle A node from which styles can be copied from - the node that is created from this function is a .clone() of cellStyle
 * @param graph The graph to add the node to
 * @returns The node that was created and added to the graph
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
async function createNode(
	id: string,
	xPos: number,
	yPos: number,
	cellStyle: joint.shapes.standard.Rectangle,
	graph: joint.dia.Graph
): Promise<joint.shapes.standard.Rectangle> {
	//clone the cell to inherit its styles
	const node = cellStyle.clone();
	//fetch the associated document from the database
	await fetchDocumentByID(id.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
		let txt = 'Deleted item';
		if (doc.assetName != undefined) txt = doc.assetName;
		else if (doc.username != undefined) txt = doc.username;
		node.position(xPos, yPos);
		node.resize(txt.length * 12, 60);
		//add the name of the document (username or assetName) to the node label & put it's _id in the extra field
		node.attr({
			body: {
				fill: getRandomColor(),
				rx: 20,
				ry: 20
			},
			label: {
				text: txt,
				extra: id,
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

/**
 * Creates and adds a link to the graph
 * @param node1 A node to link
 * @param node2 The node to link node1 to
 * @param label The text for the links label
 * @param graph The graph to add the link to
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
function createLink(
	node1: joint.shapes.standard.Rectangle,
	node2: joint.shapes.standard.Rectangle,
	label: string,
	graph: joint.dia.Graph
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

/**
 * Adds associated documents to the graph
 * @param root The node that represents the document from which the associations come from
 * @param metadataFields The metadataFields of roots asset document
 * @param yPos The y position to start adding nodes from
 * @param xPos The x position to start adding nodes from
 * @param graph The graph to add to
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function addToGraph(
	root: joint.shapes.standard.Rectangle,
	metadataFields: any,
	yPos: number,
	xPos: number,
	graph: joint.dia.Graph
) {
	let counter = 1; // counter used to identify which side the next node should be created on - improves graph readability
	//go through metadata fields
	for (let [field, value] of Object.entries(metadataFields)) {
		//finds an single association / list of associations
		if (typeof value === 'string' && value.startsWith('DOCUMENT-ID: ')) {
			// adjusts the x position for the new node
			if (counter % 2 == 0) xPos = xPos - counter * 200;
			else xPos = xPos + counter * 200;
			// creates the node & links it to root
			let newNode = await createNode(value, xPos, yPos + 170, root, graph);
			nodesList.push(newNode);
			createLink(root, newNode, field, graph);
			counter++;
		} else if (
			Array.isArray(value) &&
			value.length > 0 &&
			typeof value[0] === 'string' &&
			value[0].startsWith('DOCUMENT-ID: ')
		) {
			//goes through associations
			for (let doc of value) {
				// adjusts the x position for the new node
				if (counter % 2 == 0) xPos = xPos - counter * 200;
				else xPos = xPos + counter * 200;
				// creates the node & links it to root
				let newNode = await createNode(doc, xPos, yPos + 170, root, graph);
				nodesList.push(newNode);
				createLink(root, newNode, field, graph);
				counter++;
			}
		}
	}
}

/**
 * Adds a handler for the cell:pointerclick event on paper, to trigger the expansion of the graph when a node is clicked on
 * @param paper The paper to add the handler to
 * @param yPos The y position from which nodes should start being added
 * @param xPos The x position from which nodes should start being added
 * @param graph The graph to expand
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function registerExpandingGraphHandler(
	paper: joint.dia.Paper,
	yPos: number,
	xPos: number,
	graph: joint.dia.Graph
) {
	//register event handler to listener
	paper.on('cell:pointerclick', async function (cellView: any) {
		//find the node that corresponds to the clicked node
		let nodeWanted: any;
		for (let i of nodesList) {
			if (i.attributes.attrs.label.extra == cellView.model.attributes.attrs.label.extra) {
				nodeWanted = i;
			}
		}
		//get the document that the node represents and pass its metadataFields to addToGraph()
		if (nodeWanted) {
			await fetchDocumentByID(
				nodeWanted.attributes.attrs.label.extra.replace('DOCUMENT-ID: ', '')
			).then(async (doc) => {
				yPos = yPos + 100;
				if (doc.metadataFields) await addToGraph(nodeWanted, doc.metadataFields, xPos, xPos, graph);
			});
		}
		paper.scaleContentToFit({ padding: 10 });
	});
}
