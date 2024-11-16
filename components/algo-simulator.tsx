"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


/**
 * @TODO: 
 * - split each algo into different components
 * - create code blocks for each level of algo and ensure this functionality works 
 * - create better visuals for the algorithms 
 *  - a tree for binary
 *  - animation to show the sorting of a bubble sort
 *  - a stack of boxes for stack
 *  - a queue of boxes for queue
 *  - a linked list of boxes for linked list
 * - add leetcode like examples feature/section
 *  - map this to level of difficulty
 * - provide detailed explanation of each algo (if wanted to be fancy, could implement AI here)
 */
type AlgorithmType = 'stack' | 'queue' | 'bubbleSort' | 'quickSort' | 'binarySearchTree' | 'linkedList' | 'mergeSort'

export function AlgoSimulator() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>('stack')
  const [items, setItems] = useState<number[]>([])
  const [code, setCode] = useState('')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [animationSteps, setAnimationSteps] = useState<number[][]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const getStarterCode = () => {
    switch (algorithmType) {
      case 'stack':
        return `// Stack implementation
const stack = [];

function push(item) {
  stack.push(item);
  console.log(\`Pushed \${item} to stack\`);
}

function pop() {
  if (stack.length === 0) {
    console.log("Stack is empty");
    return;
  }
  const item = stack.pop();
  console.log(\`Popped \${item} from stack\`);
}

// Operations
push(5);
push(3);
push(8);
pop();
push(1);
pop();

console.log("Final stack:", stack);`
      case 'queue':
        return `// Queue implementation
const queue = [];

function enqueue(item) {
  queue.push(item);
  console.log(\`Enqueued \${item} to queue\`);
}

function dequeue() {
  if (queue.length === 0) {
    console.log("Queue is empty");
    return;
  }
  const item = queue.shift();
  console.log(\`Dequeued \${item} from queue\`);
}

// Operations
enqueue(5);
enqueue(3);
enqueue(8);
dequeue();
enqueue(1);
dequeue();

console.log("Final queue:", queue);`
      case 'bubbleSort':
        return `// Bubble Sort implementation
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        console.log(\`Swapped \${arr[i]} and \${arr[i + 1]}\`);
        console.log("Current array:", [...arr]);
      }
    }
  } while (swapped);
  
  return arr;
}

// Test the algorithm
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);
const sortedArray = bubbleSort(unsortedArray);
console.log("Sorted array:", sortedArray);`
      case 'quickSort':
        return `// Quick Sort implementation
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];

  for (let element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      equal.push(element);
    }
  }

  console.log(\`Partitioned around pivot \${pivot}: Left \${JSON.stringify(left)}, Equal \${JSON.stringify(equal)}, Right \${JSON.stringify(right)}\`);
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// Test the algorithm
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);
const sortedArray = quickSort(unsortedArray);
console.log("Sorted array:", sortedArray);`
      case 'binarySearchTree':
        return `// Binary Search Tree implementation
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      console.log(\`Inserted \${value} as root\`);
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
        console.log(\`Inserted \${newNode.value} to the left of \${node.value}\`);
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
        console.log(\`Inserted \${newNode.value} to the right of \${node.value}\`);
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  inOrderTraversal(node = this.root) {
    if (node !== null) {
      this.inOrderTraversal(node.left);
      console.log(node.value);
      this.inOrderTraversal(node.right);
    }
  }
}

// Test the BST
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log("In-order traversal:");
bst.inOrderTraversal();`
      case 'linkedList':
        return `// Linked List implementation
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      console.log(\`Appended \${value} as head\`);
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
    console.log(\`Appended \${value}\`);
  }

  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    console.log(\`Prepended \${value}\`);
  }

  delete(value) {
    if (!this.head) {
      console.log("List is empty");
      return;
    }
    if (this.head.value === value) {
      this.head = this.head.next;
      console.log(\`Deleted \${value} from head\`);
      return;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        console.log(\`Deleted \${value}\`);
        return;
      }
      current = current.next;
    }
    console.log(\`\${value} not found in the list\`);
  }

  print() {
    let current = this.head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log("Linked List:", values.join(" -> "));
  }
}

// Test the Linked List
const list = new LinkedList();
list.append(10);
list.append(20);
list.prepend(5);
list.append(30);
list.print();
list.delete(20);
list.print();`
      case 'mergeSort':
        return `// Merge Sort implementation
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  console.log(\`Splitting: Left \${JSON.stringify(left)}, Right \${JSON.stringify(right)}\`);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  const mergedArray = [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
  console.log(\`Merged: \${JSON.stringify(mergedArray)}\`);
  return mergedArray;
}

// Test the algorithm
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);
const sortedArray = mergeSort(unsortedArray);
console.log("Sorted array:", sortedArray);`
      default:
        return ''
    }
  }

  useEffect(() => {
    setCode(getStarterCode())
  }, [algorithmType, level])

  const executeCode = () => {
    setError(null)
    const tempItems: number[] = []
    const logs: string[] = []
    const steps: number[][] = []

    const consoleLog = (...args: any[]) => {
      logs.push(args.join(' '))
    }

    try {
      // eslint-disable-next-line no-new-func
      new Function('console', code)({ log: consoleLog })
    } catch (error: any | Error ) {
      setError(`Error: ${error.message}`)
      return
    }

    // Extract items and animation steps from the logs
    logs.forEach(log => {
      if (log.startsWith('Pushed ') || log.startsWith('Enqueued ') || log.startsWith('Appended ') || log.startsWith('Prepended ')) {
        const match = log.match(/\d+/)
        if (match) {
          tempItems.push(Number(match[0]))
          steps.push([...tempItems])
        }
      } else if (log.startsWith('Popped ') || log.startsWith('Dequeued ') || log.startsWith('Deleted ')) {
        const match = log.match(/\d+/)
        if (match) {
          const index = tempItems.indexOf(Number(match[0]))
          if (index !== -1) {
            tempItems.splice(index, 1)
            steps.push([...tempItems])
          }
        }
      } else if (log.startsWith('Swapped ')) {
        const match = log.match(/Swapped (\d+) and (\d+)/)
        if (match) {
          const index1 = tempItems.indexOf(Number(match[1]))
          const index2 = tempItems.indexOf(Number(match[2]))
          ;[tempItems[index1], tempItems[index2]] = [tempItems[index2], tempItems[index1]]
          steps.push([...tempItems])
        }
      } else if (log.startsWith('Partitioned around pivot ') || log.startsWith('Splitting:') || log.startsWith('Merged:')) {
        const match = log.match(/\[(.*?)\]/g)
        if (match) {
          const newItems = match[match.length - 1].slice(1, -1).split(',').map(Number)
          tempItems.splice(0, tempItems.length, ...newItems)
          steps.push([...tempItems])
        }
      } else if (log.startsWith('Inserted ')) {
        const match = log.match(/\d+/)
        if (match) {
          tempItems.push(Number(match[0]))
          steps.push([...tempItems])
        }
      } else if (log.startsWith('Linked List:')) {
        const match = log.match(/\d+/g)
        if (match) {
          tempItems.splice(0, tempItems.length, ...match.map(Number))
          steps.push([...tempItems])
        }
      } else if (log.startsWith('Current array:') || log.startsWith('Sorted array:') || log.startsWith('Final stack:') || log.startsWith('Final queue:')) {
        const match = log.match(/\[(.*)\]/)
        if (match) {
          const newItems = match[1].split(',').map(Number)
          tempItems.splice(0, tempItems.length, ...newItems)
          steps.push([...tempItems])
        }
      }
    })

    setItems(tempItems)
    setAnimationSteps(steps)
    setCurrentStep(0)
  }

  useEffect(() => {
    if (animationSteps.length > 0) {
      const timer = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < animationSteps.length - 1) {
            return prevStep + 1
          } else {
            clearInterval(timer)
            return prevStep
          }
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [animationSteps])

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interactive Algorithm Simulator</h1>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <Select onValueChange={(value) => setAlgorithmType(value as AlgorithmType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stack">Stack</SelectItem>
              <SelectItem value="queue">Queue</SelectItem>
              <SelectItem value="bubbleSort">Bubble Sort</SelectItem>
              <SelectItem value="quickSort">Quick Sort</SelectItem>
              <SelectItem value="binarySearchTree">Binary Search Tree</SelectItem>
              <SelectItem value="linkedList">Linked List</SelectItem>
              <SelectItem value="mergeSort">Merge Sort</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <RadioGroup
          defaultValue="beginner"
          onValueChange={(value) => setLevel(value as 'beginner' | 'intermediate' | 'advanced')}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">Beginner</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">Intermediate</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced">Advanced</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">JavaScript Code Editor</h2>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-[400px] mb-2 font-mono text-sm"
          />
          <Button onClick={executeCode} className="w-full">Execute Code</Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Visual Representation</h2>
          <div className="bg-gray-100 p-4 h-[432px] overflow-y-auto">
            <AnimatePresence>
              {(animationSteps.length > 0 ? animationSteps[currentStep] : items).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto',
                    transition: { duration: 0.5 }
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white p-2 mb-2 shadow-md border border-gray-200 rounded text-center"
                  style={{
                    height: `${Math.max(20, item * 3)}px`,
                    marginTop: '4px'
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}