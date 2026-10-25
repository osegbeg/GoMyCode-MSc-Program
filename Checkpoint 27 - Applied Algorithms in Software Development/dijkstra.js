function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const nodes = Object.keys(graph);

  // 1. Initialize distances
  for (let node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;

  // 2. Process all nodes
  while (visited.size < nodes.length) {
    // Find the unvisited node with the smallest distance
    let closestNode = null;
    let shortestDistance = Infinity;

    for (let node of nodes) {
      if (!visited.has(node) && distances[node] < shortestDistance) {
        shortestDistance = distances[node];
        closestNode = node;
      }
    }

    // If no reachable closest node is left, break
    if (closestNode === null || shortestDistance === Infinity) break;

    // 3. Update distances to neighboring nodes
    const neighbors = graph[closestNode];
    for (let neighbor in neighbors) {
      const weight = neighbors[neighbor];
      const totalDistance = shortestDistance + weight;

      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance;
      }
    }

    // 4. Mark current node as visited
    visited.add(closestNode);
  }

  return distances;
}



//-----------------------TEST--------------------------------------//
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
};

console.log(dijkstra(graph, 'A')); 
// Output: { A: 0, B: 4, C: 2, D: 5 }