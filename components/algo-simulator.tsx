"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AlgorithmType = 'stack' | 'queue' | 'bubbleSort' | 'quickSort'

export function AlgoSimulator() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>('stack')
  const [items, setItems] = useState<number[]>([])
  const [code, setCode] = useState('')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [animationSteps, setAnimationSteps] = useState<number[][]>([])
  const [currentStep, setCurrentStep] = useState(0)

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
pop();`
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
dequeue();`
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

  console.log(\`Partitioned around pivot \${pivot}: Left \${left}, Equal \${equal}, Right \${right}\`);
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// Test the algorithm
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);
const sortedArray = quickSort(unsortedArray);
console.log("Sorted array:", sortedArray);`
      default:
        return ''
    }
  }

  useEffect(() => {
    setCode(getStarterCode())
  }, [algorithmType, level])

  const executeCode = () => {
    const tempItems: number[] = []
    const logs: string[] = []
    const steps: number[][] = []

    const consoleLog = (...args: any[]) => {
      logs.push(args.join(' '))
    }

    try {
      // eslint-disable-next-line no-new-func
      new Function('console', code)({ log: consoleLog })
    } catch (error:any) {
      consoleLog(`Error: ${error.message}`)
    }

    // Extract items and animation steps from the logs
    logs.forEach(log => {
      if (log.startsWith('Pushed ') || log.startsWith('Enqueued ')) {
        const match = log.match(/\d+/)
        if (match) tempItems.push(Number(match[0]))
      } else if (log.startsWith('Popped ') || log.startsWith('Dequeued ')) {
        if (algorithmType === 'stack') tempItems.pop()
        else tempItems.shift()
      } else if (log.startsWith('Swapped ')) {
        const match = log.match(/Swapped (\d+) and (\d+)/)
        if (match) {
          const newStep = [...tempItems]
          const index1 = newStep.indexOf(Number(match[1]))
          const index2 = newStep.indexOf(Number(match[2]))
          ;[newStep[index1], newStep[index2]] = [newStep[index2], newStep[index1]]
          steps.push(newStep)
        }
      } else if (log.startsWith('Partitioned around pivot ')) {
        const match = log.match(/Left (.*), Equal (.*), Right (.*)/)
        if (match) {
          const left = JSON.parse(match[1])
          const equal = JSON.parse(match[2])
          const right = JSON.parse(match[3])
          steps.push([...left, ...equal, ...right])
        }
      } else if (log.startsWith('Sorted array:')) {
        const match = log.match(/\[(.*)\]/)
        if (match) {
          tempItems.push(...match[1].split(',').map(Number))
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
                    height: `${item * 3}px`,
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