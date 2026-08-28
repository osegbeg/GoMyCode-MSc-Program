// 1.  Graph Class using a plain Object Adjacency List
class Graph {
  constructor(isDirected) {
    this.adjacencyList = {}; // Plain JS object: { "A": ["B", "C"], "B": ["A"] }
    this.isDirected = isDirected; // boolean: true or false
  }

  // Add a vertex (node)
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  // Add an edge (connection)
  addEdge(vertex1, vertex2) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);

    this.adjacencyList[vertex1].push(vertex2);

    // If undirected, add edge in the opposite direction too
    if (this.isDirected === false) {
      this.adjacencyList[vertex2].push(vertex1);
    }
  }

  // Remove an edge
  removeEdge(vertex1, vertex2) {
    // Remove vertex2 from vertex1's neighbor array
    if (this.adjacencyList[vertex1]) {
      let newList = [];
      for (let i = 0; i < this.adjacencyList[vertex1].length; i++) {
        if (this.adjacencyList[vertex1][i] !== vertex2) {
          newList.push(this.adjacencyList[vertex1][i]);
        }
      }
      this.adjacencyList[vertex1] = newList;
    }

    // If undirected, remove vertex1 from vertex2's neighbor array too
    if (this.isDirected === false && this.adjacencyList[vertex2]) {
      let newList = [];
      for (let i = 0; i < this.adjacencyList[vertex2].length; i++) {
        if (this.adjacencyList[vertex2][i] !== vertex1) {
          newList.push(this.adjacencyList[vertex2][i]);
        }
      }
      this.adjacencyList[vertex2] = newList;
    }
  }

  // Check if an edge exists
  hasEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) {
      return false;
    }

    for (let i = 0; i < this.adjacencyList[vertex1].length; i++) {
      if (this.adjacencyList[vertex1][i] === vertex2) {
        return true;
      }
    }
    return false;
  }

  // Print graph
  printGraph() {
    console.log("--- Graph Structure ---");
    for (let vertex in this.adjacencyList) {
      let neighbors = this.adjacencyList[vertex];
      console.log(vertex + " -> " + neighbors.join(", "));
    }
    console.log("");
  }

  // 2. Depth-First Search (DFS) using an explicit Stack
  dfs(startVertex) {
    if (!this.adjacencyList[startVertex]) {
      console.log("Start vertex not found.");
      return;
    }

    let stack = [startVertex];
    let visited = {};
    let result = [];

    while (stack.length > 0) {
      let current = stack.pop(); // Take from top of stack

      if (!visited[current]) {
        visited[current] = true;
        result.push(current);

        let neighbors = this.adjacencyList[current];
        // Loop backwards so we push items in natural order onto stack
        for (let i = neighbors.length - 1; i >= 0; i--) {
          let neighbor = neighbors[i];
          if (!visited[neighbor]) {
            stack.push(neighbor);
          }
        }
      }
    }

    console.log("DFS Path starting from " + startVertex + ": " + result.join(" -> "));
  }

  // 3. Breadth-First Search (BFS) using a Queue
  bfs(startVertex) {
    if (!this.adjacencyList[startVertex]) {
      console.log("Start vertex not found.");
      return;
    }

    let queue = [startVertex];
    let visited = {};
    let result = [];

    visited[startVertex] = true;

    while (queue.length > 0) {
      let current = queue.shift(); // Remove from front of queue
      result.push(current);

      let neighbors = this.adjacencyList[current];
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor); // Add to back of queue
        }
      }
    }

    console.log("BFS Path starting from " + startVertex + ": " + result.join(" -> "));
  }
}

// ==========================================
// Testing the code
// ==========================================

console.log("=== Undirected Graph Test ===");
let graph1 = new Graph(false);

graph1.addEdge("A", "B");
graph1.addEdge("A", "C");
graph1.addEdge("B", "D");
graph1.addEdge("C", "D");

graph1.printGraph();

console.log("Has edge A-B?", graph1.hasEdge("A", "B")); // true
console.log("Has edge A-D?", graph1.hasEdge("A", "D")); // false
console.log("");

graph1.dfs("A");
graph1.bfs("A");

console.log("\n=== Directed Graph Test ===");
let graph2 = new Graph(true);

graph2.addEdge("A", "B");
graph2.addEdge("A", "C");
graph2.addEdge("B", "D");
graph2.addEdge("C", "D");

graph2.printGraph();

graph2.dfs("A");
graph2.bfs("A");