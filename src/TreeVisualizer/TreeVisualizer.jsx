import React from "react";
import './TreeVisualizer.css';
import * as BST from '../BST/BinarySearchTree.js'

class Tree extends React.Component{
    renderTree(node) {
        return (
            <>
                <div className="node__link"></div>
                <div className="node__data" id = {node.data} >{node.data}</div>
                <div className="node__line"></div>
                {node.left || node.right ? (
                    <div className="node__children">
                        {node.left? (
                            <div className="node node--left">
                                {this.renderTree(node.left)}
                            </div>
                            ) : '' 
                        }
                        {node.right? (
                            <div className="node node--right">
                                {this.renderTree(node.right)}
                            </div>
                            ) : '' 
                        }
                    </div>
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
        };
    }
    status(node, data, task) {
        const curr = (node) ? document.getElementById(node.data) : null;
        const temp = document.getElementById("tempNode");
        if(node === null || data === node.data) 
        {
            let status = '';
            if (task =="ins") {
                if (node === null) status = "Found the position to add";
                else status = "Exisiting node";
            }
            else {
                if (node === null) status = "Node does not exist in the tree";
                else status = "Found the node to delete";
            }
            if(curr !== null) curr.classList.add("node__found");
            temp.classList.add("node__found");

            this.setState({status});

            setTimeout(() => { 
                if(curr !== null) curr.classList.remove("node__found");
                temp.classList.remove("node__found");
                this.setState({ 
                    tempData :'', 
                    status : '',
                })}, 1000);
        }
        else if(data > node.data) 
        {
            curr.classList.add("node__comparing");
            temp.classList.add("node__comparing");
            this.setState({
                status: "Greater, go right",
            });
            setTimeout(() => {
                curr.classList.remove("node__comparing");
                temp.classList.remove("node__comparing");
                this.status(node.right, data,task);}
                , 1000);
        }
        else if(data < node.data)
        {
            curr.classList.add("node__comparing");
            this.setState({
                status: "Lesser, go left",
            });
            setTimeout(() => {
                curr.classList.remove("node__comparing");
                temp.classList.remove("node__comparing");
                this.status(node.left, data,task);}
                , 1000);
        }
    }
    resetTree() {
        const empty = [];
        this.setState({
            tree : new BST.BinarySearchTree(),
            tempData: '',
            status: '',
        });
    }
    insertNode() {
        const newNode = +document.getElementById("insNum").value;
        const clone_tree = this.state.tree.clone(this.state.tree);
        
        this.setState({
            tempData: newNode,
        });

        this.status(this.state.tree.root,newNode,'ins');

        clone_tree.insert(newNode);


        setTimeout(() => this.setState({
            tree:clone_tree,
        }), clone_tree.findDepth(clone_tree.root, newNode) * 1000 + 1000);
    }

    deleteNode() {
        const deleteNode = +document.getElementById("delNum").value;
        const clone_tree = this.state.tree.clone(this.state.tree);

        this.setState({
            tempData: deleteNode,
        });
        this.status(this.state.tree.root, deleteNode,'remove');
        clone_tree.remove(deleteNode);

        setTimeout(()=>this.setState({
            tree:clone_tree
        }), this.state.tree.findDepth(this.state.tree.root, deleteNode) * 1000 + 1000);
    }
    render() {
        const tree = this.state.tree;
        const tempData = this.state.tempData;
        const status = this.state.status;
        return (
            <div className="container">
                <h2>Binary Search Tree</h2>
                <div>
                    <Tree  tree = {tree}/>
                    <div className="temp">
                        <div className="status">{status}</div>
                        <div className="node__data" id ="tempNode">{tempData}</div>
                    </div>
                    <div className="button_container">
                        <input type ="number" id="insNum" ></input>
                        <button onClick={() => this.insertNode()}>Insert</button>
                        <input type ="number" id="delNum" ></input>
                        <button onClick={() => this.deleteNode()}>Delete</button>
                        <button onClick={() => this.resetTree()}>Reset</button>
                    </div>
                </div>
            </div>
        );
    }
}