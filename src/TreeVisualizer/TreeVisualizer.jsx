import React from "react";
import './TreeVisualizer.css';
import * as BST from '../BST/BinarySearchTree.js'


class Tree extends React.Component{
    renderTree(node) {
        return (
            <>
                <div className="node__top"></div>
                <div className="node__container" id = {node.data} >
                    <div className= "node__data">{node.data}</div>
                    <div className= "node__height"></div>
                </div>
                {node.left || node.right ? (
                    <>
                        <div className="node__bottom"></div>
                        <div className="node__children">
                            {node.left? (
                                <div className="node node--left">
                                    <div className="node__link"></div>
                                    {this.renderTree(node.left)}
                                </div>
                            ) : '' }
                            {node.right? (
                                <div className="node node--right">
                                    <div className="node__link"></div>
                                    {this.renderTree(node.right)}
                                </div>
                            ) : '' }
                        </div>
                    </>
                    ) :''
                }
            </>
        );
    }
    render() {
        const tree = this.props.tree;
        return (
            <div className="tree">
            {
                tree.root ? (
                    <div className="node node--root">
                        {this.renderTree(tree.root)}
                    </div>
                ) :''
            }   
            </div>
        );
    }
}


export default class TreeVisualizer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            tree: new BST.BinarySearchTree(),
            tempData: '',
            status:'',
            checklist: [],
            history: [],
            result: [],
        };
    }

    /*  Function the update status and control node color    
    */
    status(node, data, task) {
        const curr = (node) ? document.getElementById(node.data).children[0] : null; // current node 
        const temp = document.getElementById("tempNode"); // temp node
        const history = this.state.history; // history
        const result = this.state.result; // result for each step in history

        // Node is found or it just doesn't exist
        if(node === null || data === node.data) 
        {
            let status = ''; // store status

            // Check the task so generate suitable status

            // Insert task
            if (task === "ins") {
                history.push("Insert " + data + " into the tree");
                if (node === null) {
                    status = "Found the position to add";
                    result.push("Completed")
                }
                else {
                    status = "Existing node";
                    result.push("Existing node");
                }
            }

            // Delete task
            else if (task === "del") {
                history.push ("Delete " +data + " from the tree");
                if (node === null) {
                    status = "Node does not exist";
                    result.push("Node doesn't exist")
                }
                else {
                    status = "Found the node to delete";
                    result.push("Completed")
                }
            }

            // Finding node task
            else if (task === "find") {
                history.push ("Find " + data + " in the tree");
                if (node === null) {
                    status = "Node does not exist";
                    result.push("Not found")
                }
                else {
                    status = "Found the node";
                    result.push("Found");
                }
            }

            // If node exist then add class to both temp and current node to update color
            // otherwise just add class to the temp node 
            if(curr !== null) curr.classList.add("node__completed");
            temp.classList.add("node__completed");

            // Status need to update before because it will only appear in the short time 
            // and will be delete in the next update below with the timeout
            this.setState({status});

            // Set the timeout for removing class for both temp node and current node to control color of node
            // and also update the state with the new result and history
            setTimeout(() => { 
                if(curr !== null) curr.classList.remove("node__completed");
                temp.classList.remove("node__completed");
                this.setState({
                    result:result,
                    history: history,
                    tempData :'', 
                    status : '',
                })}, 1000);
        }

        // The given data is greater than current node data
        else if(data > node.data) 
        {
            // Adding class to control color
            curr.classList.add("node__processing");
            temp.classList.add("node__processing");

            // Update status
            this.setState({
                status: "Greater, go right",
            });

            // Set the timeout for remove the class and go on to the right of current node
            setTimeout(() => {
                curr.classList.remove("node__processing");
                temp.classList.remove("node__processing");
                this.status(node.right, data,task);}
                , 1000);
        }

        // The given data is lower than current node data
        else if(data < node.data)
        {
            // Adding class to control color
            curr.classList.add("node__processing");
            temp.classList.add("node__processing");

            // Update status
            this.setState({
                status: "Lesser, go left",
            });

            // Set the timeout for remove calss and go on to the left of current node
            setTimeout(() => {
                curr.classList.remove("node__processing");
                temp.classList.remove("node__processing");
                this.status(node.left, data,task);}
                , 1000);
        }
    }

    /*  Function to reset tree (reset whole state)
    */
    resetTree() {
        this.setState({
            tree : new BST.BinarySearchTree(),
            tempData: '',
            status: '',
            checklist: [],
            history: [],
            result: [],
        });
    }

    /*  Generate a random tree (10 nodes) in the range that user specify 
    */
    randomTree() {
        const min = +document.getElementById("lowerBound").value; // The lower bound to generate number
        const max = +document.getElementById("upperBound").value; // The upper bound to generate number
        const tree = new BST.BinarySearchTree(); // The new tree
        
        // Generate number in the range and added it to the new tree
        for (let i =0; i < 10; i++) {
            tree.insert(Math.floor(Math.random() * (max - min)) + min);
        }
        
        // Reset the whole state
        this.resetTree();

        // Update the new tree
        this.setState({
            tree: tree,
        });
    }

    /*  Insert a node with the user given value into the tree
    */
    insertNode() {
        const newNode = +document.getElementById("insNum").value; // The value of new node
        const clone_tree = this.state.tree.clone(this.state.tree); // The clone tree
        const checklist = generateChecklist("ins"); // Check list for inserting function
        
        // Update checklist and temp node with the given data
        this.setState({
            checklist: checklist,
            tempData: newNode,
        });

        // Generate status
        this.status(this.state.tree.root,newNode,"ins");

        // Insert the new node to the clone tree so we can find the actual depth of the new node in the tree to generate a accurate timeout
        // Because if we insert it to the original tree it will do an instant update
        // And since we want to delay the update until the animation is done then just insert it to clone tree
        clone_tree.insert(newNode);

        // Set timeout for updating tree and the time will be calculated by the depth of the new node in the tree
        // Because each depth (level) will take 1000ms(1s) to generate status and animation
        setTimeout(() => this.setState({
            tree:clone_tree,
        }), clone_tree.findDepth(clone_tree.root, newNode) * 1000 + 1000);
    }

    /*  Remove a node with the user given value from the tree
    */
    deleteNode() {
        const deleteNode = +document.getElementById("delNum").value; // The value want to delete
        const clone_tree = this.state.tree.clone(this.state.tree); // The clone tree 
        const checklist = generateChecklist("del");

        // Update checklist and temp node with the given data
        this.setState({
            checklist: checklist,
            tempData: deleteNode,
        });

        // Generate status
        this.status(this.state.tree.root, deleteNode,"del");

        // Just remove the node from the clone tree because do not want an instant update
        // And still have to check the depth of the remove node in original tree so clone tree is perfect for this task
        clone_tree.remove(deleteNode);

        // Set timeout for updating tree and the time will be calculated by the depth of the new node in the tree
        // Because each depth (level) will take 1000ms(1s) to generate status and animation
        setTimeout(()=>this.setState({
            tree:clone_tree
        }), this.state.tree.findDepth(this.state.tree.root, deleteNode) * 1000 + 1000);
    }


    /* Find node in the tree */
    findNode() {
        const newNode = +document.getElementById("nodeFind").value;
        const checklist = generateChecklist("find");
        this.status(this.state.tree.root,newNode,"find");
        this.setState({checklist});
    }

    height() 
    {
        const tree = this.state.tree;
        const height = tree.findHeight(tree.root);
        const checklist = generateChecklist("height");
        const history = this.state.history;
        const result = this.state.result;

        history.push("Height of the tree");
        this.setState({
            checklist: checklist,
            history: history,
        });

        heightAnimation(tree.root, 0);

        result.push(height);
        setTimeout(() => {
            this.setState({
                result: result,
            }); 
        }, height * 1000 + 2000);
    }
    
    print(order) {
        const checklist = generateChecklist(order);
        var status,index;
        const tree = this.state.tree;
        const history = this.state.history;
        const result = this.state.result;
        let arrayHolder = [];
        
        if (order === "preorder") {
            status = "Preorder: ";
            history.push("Preorder");
            arrayHolder = tree.preorder(tree.root, arrayHolder);
            index = 10;
        } else if (order === "inorder") {
            status = "Inorder: ";
            history.push("Inorder");
            arrayHolder = tree.inorder(tree.root, arrayHolder);
            index = 9;
        } else {
            status = "Postorder: ";
            history.push("Postorder");
            arrayHolder = tree.postorder(tree.root, arrayHolder);
            index = 11;
        }
        
        this.setState({
            checklist : checklist,
            history : history,
        });

        for (let i = 0; i < arrayHolder.length ; i++) {
            const node = document.getElementById(arrayHolder[i]).children[0];

            setTimeout(() => {
                node.classList.add("node__processing");
                status += arrayHolder[i];
                if (i !== arrayHolder.length - 1) status += ", ";
            }, i*1000);

            setTimeout(() => {
                this.setState({status});
                node.classList.remove("node__processing");
                node.classList.add("node__completed");
            },i*1000 + 1000);
        }

        setTimeout(() => {
            for (let i = 0; i < arrayHolder.length; i++) {
                const node = document.getElementById(arrayHolder[i]).children[0];
                node.classList.remove("node__completed");
            }

            result.push(status.slice(index));
            this.setState({
                result: result,
                status: "",
            });
        }, arrayHolder.length * 1000 + 2000);
    }

    render() {
        const tree = this.state.tree;
        const tempData = this.state.tempData;
        const status = this.state.status;
        const checklist= this.state.checklist ? this.state.checklist.map((stepText,stepNum) => {
            const step = "Step #" + (stepNum+1) + ": " + stepText;
            return (
                <tr key = {stepNum}>
                    <td>{step}</td>
                </tr>
            );
        }) : '';

        const history= this.state.history ? this.state.history.map((text, index) => {
            const desc = (index+1)+ ". " + text;
            const res = this.state.result[index];
            return (
                <tr key = {index}>
                    <td>{desc} : {res}</td>
                </tr>
            )
        }) : '';

        return (
            <div className="container">
                <h2>Binary Search Tree</h2>
                <div>
                    <div className="button_container">
                        <div>
                            <input type ="number" id="insNum" ></input>
                            <button onClick={() => this.insertNode()}>Insert</button>
                        </div>
                        <div>
                            <input type ="number" id="delNum" ></input>
                            <button onClick={() => this.deleteNode()}>Delete</button>
                        </div>
                        <div>
                            <button onClick={() => this.randomTree()}>Random tree</button>
                            <input type ="number" id="lowerBound" defaultValue={0}></input>
                            <input type ="number" id="upperBound" defaultValue={99}></input>
                        </div>
                        <div>
                            <button onClick={() => this.findNode()}>Find node</button>
                            <input type ="number" id = "nodeFind"></input>
                        </div>
                        <div>
                            <button onClick={() => this.height()}>Height</button>
                        </div>
                        <div><button onClick={() =>this.print("preorder")}>Preorder</button></div>
                        <div><button onClick={() =>this.print("inorder")}>Inorder</button></div>
                        <div><button onClick={() =>this.print("postorder")}>Postorder</button></div>
                        <div>
                            <button onClick={() => this.resetTree()}>Reset</button>
                        </div>
                    </div>
                    <div className="utility">
                        <div className="checklist">
                            <table>
                                <thead>
                                    <tr><th>Checklist</th></tr>
                                </thead>
                                <tbody>{checklist}</tbody>
                            </table>
                        </div>
                        <div className="temp">
                            <div className="node__data" id ="tempNode">{tempData}</div>
                            <div className="status">{status}</div>
                        </div>
                        <div className="history">
                            <table>
                                <thead>
                                    <tr><th>History</th></tr>
                                </thead>
                                <tbody>{history}</tbody>
                            </table> 
                        </div>  
                    </div>
                    <Tree  tree = {tree}/>
                </div>
            </div>
        );
    }
}



function generateChecklist(task) {
    let checklist = [];
    if (task === "ins") {
        checklist[0] = "Create a node with the given value";
        checklist[1] = "Find the suitable position by comparing";
        checklist[2] = "Insert the node into the tree";
    }

    if (task === "del") {
        checklist[0] = "Find the node with the given value";
        checklist[1] = "Count the child of the node";
        checklist[2] = "Remove the node from the tree";
    }

    if (task === "find") {
        checklist[0] = "Find the node with the given value";
    }

    if (task === "height") {
        checklist[0] = "Checking if the tree is empty";
        checklist[1] = "Find the height of left sub-tree";
        checklist[2] = "Find the height of right sub-tree";
        checklist[3] = "Compare them to take the bigger and plus 1 because there is 1 edge from the root to both left and right sub-tree";
    }
    if (task === "preorder") {
        checklist[0] = "Data";
        checklist[1] = "Go to left child if exist";
        checklist[2] = "Go to right child if exist";
    }
    if (task === "inorder") {
        checklist[0] = "Go to left child if exist";
        checklist[1] = "Data";
        checklist[2] = "Go to right child if exist";
    }
    if (task === "postorder") {
        checklist[0] = "Go to left child if exist";
        checklist[1] = "Go to right child if exist";
        checklist[2] = "Data";
    }
    return checklist;
}

function heightAnimation(node, level = 0) {
    if (node !== null) {
        let nodeElement = document.getElementById(node.data).children[0];
        let nodeHeight = document.getElementById(node.data).children[1];

        level++;

        nodeElement.classList.add("node__processing");

        setTimeout(() => {
            nodeElement.classList.remove("node_processing");
            nodeElement.classList.add("node__completed");
            nodeHeight.innerHTML = level - 1;
            heightAnimation(node.left, level);
            heightAnimation(node.right, level);
        }, 1000 );
    }
}
