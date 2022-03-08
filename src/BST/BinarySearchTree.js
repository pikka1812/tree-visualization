export class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // function to be implemented
    insert(data) {
        const newNode = new Node(data); // declare and init new node
        
        if(this.root === null) this.root = newNode;
        else this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if(newNode.data < node.data)
        {
            if(node.left === null) node.left = newNode;
            else this.insertNode(node.left, newNode);
        }
        else if (newNode.data > node.data)
        {
            if(node.right === null) node.right = newNode;
            else this.insertNode(node.right,newNode);
        }
    }
    remove(data) {
        this.root = this.removeNode(this.root, data);
    }

    removeNode(node, data) {
        if(node === null) return node;
        if(data < node.data) {
            node.left = this.removeNode(node.left, data);
        }
        else if(data > node.data) {
            node.right = this.removeNode(node.right, data);
        }
        else {
            // no child
            if (node.right === null && node.left === null) {
                node = null;
            } else if (node.left === null) { // 1 child right
                node = node.right;
            } else if (node.right === null) { // 1 child left
                node = node.left;
            } else { // 2 childs
                const temp = this.findMinNode(node.right) // take the min of right subtree (will only have right child or none)
                node.data = temp.data;

                node.right = this.removeNode(node.right, temp.data); // remove the duplicate
            }
        }
        return node;
    }
    
    findMinNode(node) {
        if (node.left === null) return node;
        else this.findMinNode(node.left); 
    }
    
    findDepth(root, data) {
        if (root === null) return -1;
        if (root.data === data) return 0;
        if (data < root.data) return this.findDepth(root.left, data)+1;
        if (data > root.data) return this.findDepth(root.right, data)+1; 
    }
    cloneNode(node) {
        if(node === null) return null;
        
        let clone = new Node(node.data);
        clone.left = this.cloneNode(node.left);
        clone.right = this.cloneNode(node.right);

        return clone;
    }
    clone(tree) {
        let tempTree = new BinarySearchTree();
        tempTree.root = this.cloneNode(tree.root);
        return tempTree;
    }

    findHeight(root) {
        if (root === null ) return -1;
        const left = this.findHeight(root.left);
        const right = this.findHeight(root.right);
        return left > right ? left + 1 : right + 1;
    } 

    preorder (node, arrayHolder) {
        if (node !== null) {
            arrayHolder.push(node.data);
            arrayHolder = this.preorder(node.left, arrayHolder);
            arrayHolder = this.preorder(node.right, arrayHolder);
        }
        return arrayHolder;
    }

    inorder (node, arrayHolder) {
        if (node !== null) {
            arrayHolder = this.inorder(node.left, arrayHolder);
            arrayHolder.push(node.data);
            arrayHolder = this.inorder(node.right, arrayHolder);
        }
        
        return arrayHolder;
    }

    postorder(node, arrayHolder) {
        if (node !== null) {
            arrayHolder = this.postorder(node.left, arrayHolder);
            arrayHolder = this.postorder(node.right, arrayHolder);
            arrayHolder.push (node.data);
        }
        return arrayHolder;
    }
    // Helper function
    // getRootNode()
    // search(node, data)
}