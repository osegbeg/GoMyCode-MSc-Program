// ============================================================================
// PART 1: QUEUE IMPLEMENTATIONS
// ============================================================================

// ----------------------------------------------------------------------------
// 1A. Array-based Queue (Fixed Size Circular Buffer)
// ----------------------------------------------------------------------------
class ArrayQueue {
  constructor(capacity = 5) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
  }

  // Add an element to the queue
  enqueue(element) {
    if (this.size === this.capacity) {
      console.log("Error: Queue is full (Overflow)");
      return false;
    }
    this.items[this.rear] = element;
    this.rear = (this.rear + 1) % this.capacity; // Circular wrap
    this.size++;
    return true;
  }

  // Remove and return the front element
  dequeue() {
    if (this.isEmpty()) {
      console.log("Error: Queue is empty (Underflow)");
      return null;
    }
    let removed = this.items[this.front];
    this.items[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity; // Circular wrap
    this.size--;
    return removed;
  }

  // Return front element without removing it
  peek() {
    if (this.isEmpty()) {
      console.log("Error: Queue is empty");
      return null;
    }
    return this.items[this.front];
  }

  // Check if queue is empty
  isEmpty() {
    return this.size === 0;
  }
}

// ----------------------------------------------------------------------------
// 1B. Linked List-based Queue (Dynamic Size)
// ----------------------------------------------------------------------------
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListQueue {
  constructor() {
    this.head = null; // Front of the queue
    this.tail = null; // Back of the queue
    this.length = 0;
  }

  // Add an element to the queue
  enqueue(element) {
    let newNode = new Node(element);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return true;
  }

  // Remove and return the front element
  dequeue() {
    if (this.isEmpty()) {
      console.log("Error: Queue is empty (Underflow)");
      return null;
    }
    let removedValue = this.head.value;
    this.head = this.head.next;
    this.length--;

    if (this.isEmpty()) {
      this.tail = null;
    }

    return removedValue;
  }

  // Return front element without removing it
  peek() {
    if (this.isEmpty()) {
      console.log("Error: Queue is empty");
      return null;
    }
    return this.head.value;
  }

  // Check if queue is empty
  isEmpty() {
    return this.length === 0;
  }
}


// ============================================================================
// PART 2: PRIORITY QUEUE IMPLEMENTATIONS
// ============================================================================

// ----------------------------------------------------------------------------
// 2A. Min-Heap-based Priority Queue
// ----------------------------------------------------------------------------
class MinHeapPriorityQueue {
  constructor() {
    // Array storing objects: { element, priority }
    this.heap = [];
  }

  // Helper index calculators
  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  // Swap helper
  swap(i, j) {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  // Restore min-heap property upward
  heapifyUp(index) {
    while (
      index > 0 &&
      this.heap[index].priority < this.heap[this.getParentIndex(index)].priority
    ) {
      let parentIndex = this.getParentIndex(index);
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  // Restore min-heap property downward
  heapifyDown(index) {
    let smallest = index;
    let left = this.getLeftChildIndex(index);
    let right = this.getRightChildIndex(index);

    if (
      left < this.heap.length &&
      this.heap[left].priority < this.heap[smallest].priority
    ) {
      smallest = left;
    }

    if (
      right < this.heap.length &&
      this.heap[right].priority < this.heap[smallest].priority
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  // Insert element with given priority
  insert(element, priority) {
    let node = { element: element, priority: priority };
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  // Remove and return element with minimum priority
  extractMin() {
    if (this.isEmpty()) {
      console.log("Error: Priority Queue is empty");
      return null;
    }
    if (this.heap.length === 1) {
      return this.heap.pop().element;
    }

    let minElement = this.heap[0].element;
    this.heap[0] = this.heap.pop(); // Move last node to root
    this.heapifyDown(0);

    return minElement;
  }

  // Peek element with minimum priority
  peekMin() {
    if (this.isEmpty()) {
      console.log("Error: Priority Queue is empty");
      return null;
    }
    return this.heap[0].element;
  }

  // Check if priority queue is empty
  isEmpty() {
    return this.heap.length === 0;
  }
}

// ----------------------------------------------------------------------------
// 2B. Ordered Array-based Priority Queue (Sorted ascending by priority)
// ----------------------------------------------------------------------------
class OrderedArrayPriorityQueue {
  constructor() {
    // Array storing objects: { element, priority }
    this.items = [];
  }

  // Insert maintaining sorted order (smallest priority at index 0)
  insert(element, priority) {
    let node = { element: element, priority: priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (priority < this.items[i].priority) {
        this.items.splice(i, 0, node); // Insert at index i
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(node); // Append to end if largest priority
    }
  }

  // Remove and return element with minimum priority
  extractMin() {
    if (this.isEmpty()) {
      console.log("Error: Priority Queue is empty");
      return null;
    }
    // Smallest priority element is always at index 0
    return this.items.shift().element;
  }

  // Peek minimum priority element
  peekMin() {
    if (this.isEmpty()) {
      console.log("Error: Priority Queue is empty");
      return null;
    }
    return this.items[0].element;
  }

  // Check if priority queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
}


// ============================================================================
// DEMONSTRATION & EDGE CASE VERIFICATION
// ============================================================================

console.log("=== 1. TESTING ARRAY-BASED QUEUE (CIRCULAR) ===");
let arrayQueue = new ArrayQueue(3);
console.log("Is empty?", arrayQueue.isEmpty()); // true
arrayQueue.enqueue("A");
arrayQueue.enqueue("B");
arrayQueue.enqueue("C");
arrayQueue.enqueue("D"); // Overflow trigger
console.log("Peek:", arrayQueue.peek()); // "A"
console.log("Dequeued:", arrayQueue.dequeue()); // "A"
arrayQueue.enqueue("D"); // Should succeed due to circular wrap
console.log("Dequeued:", arrayQueue.dequeue()); // "B"

console.log("\n=== 2. TESTING LINKED LIST-BASED QUEUE ===");
let llQueue = new LinkedListQueue();
llQueue.enqueue("Task 1");
llQueue.enqueue("Task 2");
console.log("Peek:", llQueue.peek()); // "Task 1"
console.log("Dequeued:", llQueue.dequeue()); // "Task 1"
console.log("Dequeued:", llQueue.dequeue()); // "Task 2"
console.log("Dequeued from empty:", llQueue.dequeue()); // Underflow trigger

console.log("\n=== 3. TESTING MIN-HEAP PRIORITY QUEUE ===");
let minHeapPQ = new MinHeapPriorityQueue();
minHeapPQ.insert("Low Priority Task", 10);
minHeapPQ.insert("Critical Bug Fix", 1);
minHeapPQ.insert("Medium Feature", 5);
console.log("Peek Min:", minHeapPQ.peekMin()); // "Critical Bug Fix"
console.log("Extract Min:", minHeapPQ.extractMin()); // "Critical Bug Fix" (prio 1)
console.log("Extract Min:", minHeapPQ.extractMin()); // "Medium Feature" (prio 5)

console.log("\n=== 4. TESTING ORDERED ARRAY PRIORITY QUEUE ===");
let arrayPQ = new OrderedArrayPriorityQueue();
arrayPQ.insert("Patient C (Non-urgent)", 3);
arrayPQ.insert("Patient A (Critical)", 1);
arrayPQ.insert("Patient B (Urgent)", 2);
console.log("Extract Min:", arrayPQ.extractMin()); // "Patient A (Critical)"
console.log("Extract Min:", arrayPQ.extractMin()); // "Patient B (Urgent)"