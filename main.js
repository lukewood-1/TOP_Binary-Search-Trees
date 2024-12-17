class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor() {
        this.root = null;
    }

    buildTree(arr) {
        if (arr.length === 0)
            throw new Error('array is empty');

        this.root = new Node(arr.toSorted( (a, b) => a - b)[Math.floor(arr.length / 2)]);

        const traverse = (node, arr) => {
            if (arr.length === 0)
                return;
            let next = arr[0];
            if (next < node.data) {
                if (node.left) {
                    return traverse(node.left, arr);
                } else {
                    node.left = new Node(next);
                }
            } else if (next > node.data) {
                if (node.right) {
                    return traverse(node.right, arr);
                } else {
                    node.right = new Node(next);
                }
            }
            return traverse(this.root, arr.slice(1));
        }
        traverse(this.root, arr);

        return this
    }

    insert(value) {
        let newEntry = new Node(value);

        const pusher = node => {
            if (!node)
                return;

            if (newEntry.data < node.data) {
                if (node.left)
                    return pusher(node.left)
                else
                    node.left = newEntry;
            } else if (newEntry.data > node.data) {
                if (node.right)
                    return pusher(node.right)
                else
                    node.right = newEntry;
            }
        }
        pusher(this.root)

        return this
    }

    recycleSubtree(node) {
        let queue = [];

        if (node.left)
            queue.push(node.left);
        if (node.right)
            queue.push(node.right);

        const placeNode = (node, target=this.root) => {
            if (!this.root) {
                return this.root = node;
            }

            if (node.data < target.data) {
                if (target.left)
                    return placeNode(node, target.left);
                else
                    target.left = node;
            }
            if (node.data > target.data) {
                if (target.right)
                    return placeNode(node, target.right);
                else
                    target.right = node;
            }
        }

        queue.forEach(item => {
            placeNode(item);
        }
        );

        return this;
    }

    deleteItem(target) {
        if (!this.root)
            return false;

        if (target === this.root.data) {
            let deleted = this.root;
            this.root = null;
            return this.recycleSubtree(deleted);
        }
        ;
        const seek = (node, data) => {
            if (!node)
                throw new Error("coudn't find node");

            if( (!node.left && node.data !== data) || (!node.right && node.data !== data) ){
                return false;
            }
            if (data > node.right.data) {
                seek(node.right, data)
            }
            else if (node.left.right){
                if(data === node.left.right.data) {
                    let deleted = node.left.right;
                    node.left.right = null;
                    return this.recycleSubtree(deleted);
                }
            }
            else if (data < node.left.data) {
                seek(node.left, data)
            } 
            else if (data === node.left.data || data === node.right.data) {
                let deleted;
                if (data === node.left.data) {
                    deleted = node.left;
                    node.left = null;
                    return this.recycleSubtree(deleted);
                } else if (data === node.right.data) {
                    deleted = node.right;
                    node.right = null;
                    return this.recycleSubtree(deleted);
                }
            } else
                return false;

        }
    
        return seek(this.root, target)
    }

    find(value, target=this.root) {
        if (value === target.data)
            return target;

        if (value < target.data) {
            if (target.left)
                return this.find(value, target.left)
            else
                return false
        } else if (value > target.data) {
            if (target.right)
                return this.find(value, target.right)
            else
                return false
        }
    }

    levelOrder(callback) {
        if (callback === undefined)
            throw new Error('Missing callback');
        let queue = [];
        queue.push(this.root);
        let current;
        for (let i of queue) {
            if (i.left)
                queue.push(i.left);
            if (i.right)
                queue.push(i.right);
        }
        for (let item of queue) {
            callback(item)
        }
    }

    inOrder(callback) {
        if(!callback) throw new Error('MIssing callback');
        
        const traverseAndCall = node => {
            if (node.left)
                traverseAndCall(node.left);
                callback(node);
            if (node.right)
                traverseAndCall(node.right);
        }
        traverseAndCall(this.root)
    }
    
    preOrder(callback) {
        if(!callback) throw new Error('MIssing callback');
        
        const traverseAndCall = node => {
            callback(node);
            if (node.left)
                traverseAndCall(node.left);
            if (node.right)
                traverseAndCall(node.right);
        }
        traverseAndCall(this.root)
    }

    postOrder(callback) {
        if(!callback) throw new Error('MIssing callback');
        
        const traverseAndCall = node => {
            if (node.left)
                traverseAndCall(node.left);
            if (node.right)
                traverseAndCall(node.right);
            callback(node);
        }
        traverseAndCall(this.root)
    }

    depth(target){
        let count = 0;

        const traverseToLeaf = node => {
            if(target === node.data){
                return
            }
            
            else {
                if(target < node.data){
                    if(node.left){
                        count++;
                        return traverseToLeaf(node.left);
                    }
                    else if(node.right){
                        count++;
                        return traverseToLeaf(node.right);
                    }
                    else return;
                }
                else if(target > node.data){
                    if(node.right) {
                        count++;
                        return traverseToLeaf(node.right);
                    }
                    else if(node.left){
                        count++;
                        return traverseToLeaf(node.left);
                    }
                    else return;
                }
            }
        }
        traverseToLeaf(this.root);

        return count;
    }

    height(nodeData){
        let countLeft = 0,
            countRight = 0;
        

        const traverseNoCount = target => {
            if(target.data === nodeData) {
                if(target.left || target.right) {
                    traverseLeft(target);
                    traverseRight(target);
                }
                else return
            }
            
            else {
                if(target.data < nodeData){
                    if(target.right) return traverseNoCount(target.right)
                    else return;
                } else if(target.data > nodeData){
                    if(target.left) return traverseNoCount(target.left)
                    else return;
                }
                else
                    throw new Error('node not found');
            }
        }

        const traverseLeft = target => {
            if(!target.left && !target.right) return;
        
            if(target.left){
                countLeft++;
                return traverseLeft(target.left);
            }
            else if(target.right){
                countLeft++;
                return traverseLeft(target.right);
            }
            else return
        }

        const traverseRight = target => {
            if(!target.left && !target.right) return;

            if(target.right){
                countRight++;
                return traverseRight(target.right);
            }
            else if(target.left){
                countRight++;
                return traverseRight(target.left);
            }
            else return 
        }
        
        traverseNoCount(this.root);

        return countLeft > countRight ? countLeft : countRight
    }

    isBalanced(){
        const checkBalance = (node = this.root) => {
            if(!node) return 0

            const leftHeight = checkBalance(node.left);
            if(leftHeight === -1) return -1

            const rightHeight = checkBalance(node.right);
            if(rightHeight === -1) return -1

            if(Math.abs(leftHeight - rightHeight) > 1) return -1

            return 1 + Math.max(leftHeight, rightHeight);
        }

        return checkBalance() !== -1
    }

    rebalance(){
        let queue = [];

        const inOrderEnqueue = (node = this.root) => {
            // if(!node) return;
            queue.push(node.data);
            
            if(node.left){
                inOrderEnqueue(node.left)
            }
            
            if(node.right){
                inOrderEnqueue(node.right)
            }
        }
        inOrderEnqueue();

        const newTree = this.buildTree(queue);

        this.root = newTree.root;
        
        return this
    }

}

