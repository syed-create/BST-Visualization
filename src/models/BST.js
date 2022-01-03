import Node from "./Node";

// Binary Search tree class
class BinarySearchTree {
	constructor() {
		this.array = [];
		this.root = null;
	}
	insert(data) {
		var newNode = new Node(data);
		if (this.root === null) {
			this.root = newNode;
		} else {
			this.insertNode(this.root, newNode);
		}
	}
	insertNode(node, newNode) {
		if (newNode.data < node.data) {
			if (node.left === null) {
				node.left = newNode;
			} else {
				this.insertNode(node.left, newNode);
			}
		} else {
			if (node.right === null) {
				node.right = newNode;
			} else {
				this.insertNode(node.right, newNode);
			}
		}
	}
	remove(data) {
		this.root = this.removeNode(this.root, data);
	}

	// Method to remove node with a
	// given data
	// it recur over the tree to find the
	// data and removes it
	removeNode(node, key) {
		// console.log("node", node);
		// console.log("key", key);
		// if the root is null then tree is
		// empty
		if (node === null) {
			return null;
		}
		// if data to be delete is less than
		// roots data then move to left subtree
		else if (key < node.data) {
			node.left = this.removeNode(node.left, key);
			return node;
		}

		// if data to be delete is greater than
		// roots data then move to right subtree
		else if (key > node.data) {
			node.right = this.removeNode(node.right, key);
			return node;
		}

		// if data is similar to the root's data
		// then delete this node
		else {
			// deleting node with no children
			if (node.left === null && node.right === null) {
				node = null;
				return node;
			}

			// deleting node with one children
			if (node.left === null) {
				node = node.right;
				// console.log("node delete", node);
				return node;
			} else if (node.right === null) {
				node = node.left;
				return node;
			}

			// Deleting node with two children
			// minimum node of the right subtree
			// is stored in aux
			var aux = this.findMinNode(node.right);
			node.data = aux.data;

			node.right = this.removeNode(node.right, aux.data);
			return node;
		}
	}
	// finds the minimum node in tree
	// searching starts from given node
	findMinNode(node) {
		// if left of a node is null
		// then it must be minimum node
		if (node.left === null) {
			return node;
		} else {
			return this.findMinNode(node.left);
		}
	}

	// Helper function
	// findMinNode()
	// returns root of the tree
	getRootNode() {
		return this.root;
	}
	//postOrder Getters Setters
	setArrayPost() {
		this.arrayPost = [];
	}
	getArrayPost() {
		return this.arrayPost;
	}

	//pre Order Getter setter
	setArrayPreOrder() {
		this.arrayPre = [];
	}
	getArrayPreOrder() {
		return this.arrayPre;
	}
	// inorder(node)
	//In order getter Setter
	setArrayInorder() {
		this.arrayIn = [];
	}
	getArrayInorder() {
		return this.arrayIn;
	}

	inorder(node) {
		if (node !== null) {
			this.inorder(node.left);
			this.arrayIn.push(node.data);
			this.inorder(node.right);
		}
	}
	// preorder(node)

	preOrder(node) {
		if (node !== null) {
			this.arrayPre.push(node.data);
			this.preOrder(node.left);
			this.preOrder(node.right);
		}
	}
	// Performs postorder traversal of a tree
	postorder(node) {
		if (node !== null) {
			this.postorder(node.left);
			this.postorder(node.right);
			this.arrayPost.push(node.data);
		}
	}

	setlevelOrder() {
		this.arrayLevel = [];
	}
	getLevelOrder() {
		return this.arrayLevel;
	}
	//**Level order ///
	LevelOrder(node) {
		// let tempNode = new Node();
		if (node !== null) {
			let queue = [];

			queue.push(node);

			while (queue.length !== 0) {
				let tempNode = queue.shift();
				this.arrayLevel.push(tempNode);

				if (tempNode.left !== null) {
					queue.push(tempNode.left);
				}
				if (tempNode.right !== null) {
					queue.push(tempNode.right);
				}
			}
		}
	}

	// search for a node with given data
	search(node, data) {
		// if trees is empty return null
		if (node === null) {
			return null;
		}
		// if data is less than node's data
		// move left
		else if (data < node.data) {
			return this.search(node.left, data);
		}
		// if data is less than node's data
		// move left
		else if (data > node.data) {
			return this.search(node.right, data);
		}
		// if data is equal to the node data
		// return node
		else {
			return node;
		}
	}
}
export default BinarySearchTree;
