// ============================================================================
// 1. DISJOINT SET (UNION-FIND) WITH PATH COMPRESSION & RANK
// ============================================================================
class DisjointSet {
  constructor(vertices) {
    this.parent = {};
    this.rank = {};

    vertices.forEach((v) => {
      this.parent[v] = v;
      this.rank[v] = 0;
    });
  }

  // Find root representative with Path Compression
  find(i) {
    if (this.parent[i] === i) {
      return i;
    }
    this.parent[i] = this.find(this.parent[i]); // Path compression
    return this.parent[i];
  }

  // Union two sets by Rank
  union(i, j) {
    let rootI = this.find(i);
    let rootJ = this.find(j);

    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI;
        this.rank[rootI]++;
      }
      return true; // Successfully merged two components
    }
    return false; // Cycle detected
  }
}

// ============================================================================
// 2. KRUSKAL'S MST BUILDER
// ============================================================================
class NetworkGraph {
  constructor() {
    this.vertices = new Set();
    this.edges = [];
  }

  // Dynamically add a computer node
  addNode(nodeName) {
    this.vertices.add(nodeName);
  }

  // Dynamically add a potential cable connection
  addConnection(u, v, cost) {
    this.vertices.add(u);
    this.vertices.add(v);
    this.edges.push({ u, v, cost });
  }

  // Compute Minimum Spanning Tree
  computeMST() {
    let vertexList = Array.from(this.vertices);

    // Edge Case 1: Empty Graph
    if (vertexList.length === 0) {
      return { selectedEdges: [], totalCost: 0, isConnected: true };
    }

    // Edge Case 2: Single Node
    if (vertexList.length === 1) {
      return { selectedEdges: [], totalCost: 0, isConnected: true };
    }

    // Step 1: Sort all edges by cost (ascending)
    let sortedEdges = [...this.edges].sort((a, b) => a.cost - b.cost);

    let ds = new DisjointSet(vertexList);
    let selectedEdges = [];
    let totalCost = 0;

    // Step 2: Iterate through sorted edges and select non-cycling edges
    for (let edge of sortedEdges) {
      // Check if including this edge forms a cycle
      if (ds.find(edge.u) !== ds.find(edge.v)) {
        ds.union(edge.u, edge.v);
        selectedEdges.push(edge);
        totalCost += edge.cost;

        // Stop early if we have selected (V - 1) edges
        if (selectedEdges.length === vertexList.length - 1) {
          break;
        }
      }
    }

    // Verify graph connectivity
    let isConnected = selectedEdges.length === vertexList.length - 1;

    return { selectedEdges, totalCost, isConnected };
  }
}

// ============================================================================
// 3. DISPLAY & VERIFICATION SUITE
// ============================================================================
function printMSTResults(graph, title) {
  console.log(`\n==================================================`);
  console.log(` ${title}`);
  console.log(`==================================================`);

  let { selectedEdges, totalCost, isConnected } = graph.computeMST();

  if (!isConnected) {
    console.log("⚠️ Warning: The graph is disconnected! MST cannot span all nodes.");
    return;
  }

  console.log("Selected Cable Connections (MST Edges):");
  if (selectedEdges.length === 0) {
    console.log("  (No cable connections required)");
  } else {
    selectedEdges.forEach((edge, index) => {
      console.log(`  ${index + 1}. Computer '${edge.u}' <---> Computer '${edge.v}' | Cost: $${edge.cost}`);
    });
  }

  console.log(`\nTotal Minimum Network Cable Cost: $${totalCost}`);
}

// ----------------------------------------------------------------------------
// TEST RUN 1: Office Layout Simulation
// ----------------------------------------------------------------------------
let officeNetwork = new NetworkGraph();

// Dynamic node & edge inputs (Computer A through Computer E)
officeNetwork.addConnection("PC-A", "PC-B", 4);
officeNetwork.addConnection("PC-A", "PC-C", 2);
officeNetwork.addConnection("PC-B", "PC-C", 1);
officeNetwork.addConnection("PC-B", "PC-D", 5);
officeNetwork.addConnection("PC-C", "PC-D", 8);
officeNetwork.addConnection("PC-C", "PC-E", 10);
officeNetwork.addConnection("PC-D", "PC-E", 2);

printMSTResults(officeNetwork, "OFFICE NETWORK CABLE LAYOUT (KRUSKAL'S MST)");

// ----------------------------------------------------------------------------
// TEST RUN 2: Dynamic Input Demonstration
// ----------------------------------------------------------------------------
let dynamicOffice = new NetworkGraph();

// Adding isolated node first
dynamicOffice.addNode("Server-Room");

// Adding dynamic connections on the fly
dynamicOffice.addConnection("Server-Room", "Reception", 15);
dynamicOffice.addConnection("Server-Room", "IT-Desk", 5);
dynamicOffice.addConnection("IT-Desk", "Reception", 7);

printMSTResults(dynamicOffice, "DYNAMIC INPUT NETWORK TEST");