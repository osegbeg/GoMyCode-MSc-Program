// Sample Input
const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 }
];


// APPROACH 1: Greedy Algorithm (Earliest End Time First)

function selectTasksGreedy(taskList) {
  if (taskList.length === 0) return [];

  // Step 1: Make a copy and sort tasks by end time
  let sorted = taskList.slice().sort(function(a, b) {
    return a.end - b.end;
  });

  let selectedTasks = [];
  let lastEndTime = 0;

  // Step 2: Pick the first task that doesn't overlap
  for (let i = 0; i < sorted.length; i++) {
    let currentTask = sorted[i];
    if (currentTask.start >= lastEndTime) {
      selectedTasks.push(currentTask);
      lastEndTime = currentTask.end;
    }
  }

  return selectedTasks;
}


// APPROACH 2: Brute-Force Algorithm (Explores All Subsets)

function selectTasksBruteForce(taskList) {
  let bestCombination = [];

  // Helper to check if a set of tasks has any overlaps
  function hasNoOverlaps(combination) {
    // Sort combination by start time to check adjacent tasks
    let sortedCombo = combination.slice().sort(function(a, b) {
      return a.start - b.start;
    });

    for (let i = 0; i < sortedCombo.length - 1; i++) {
      if (sortedCombo[i + 1].start < sortedCombo[i].end) {
        return false; // Overlap detected
      }
    }
    return true;
  }

  // Recursive function to generate all 2^N combinations
  function generateCombinations(index, currentCombination) {
    if (index === taskList.length) {
      if (hasNoOverlaps(currentCombination)) {
        if (currentCombination.length > bestCombination.length) {
          bestCombination = currentCombination.slice();
        }
      }
      return;
    }

    // Choice 1: Include taskList[index]
    currentCombination.push(taskList[index]);
    generateCombinations(index + 1, currentCombination);

    // Choice 2: Exclude taskList[index]
    currentCombination.pop();
    generateCombinations(index + 1, currentCombination);
  }

  generateCombinations(0, []);
  return bestCombination;
}


// VERIFICATION ON SAMPLE DATA

console.log("=== 1. VERIFYING CORRECTNESS ON SAMPLE DATA ===");
let greedyResult = selectTasksGreedy(tasks);
let bruteForceResult = selectTasksBruteForce(tasks);

console.log("Greedy Selected Count:", greedyResult.length);
console.log("Brute-Force Selected Count:", bruteForceResult.length);
console.log("Both algorithms return the same maximum count:", greedyResult.length === bruteForceResult.length);


// Helper to test edge case inputs
function runStressTest(label, edgeCaseTasks) {
  console.log("\n--- Edge Case: " + label + " (" + edgeCaseTasks.length + " tasks) ---");

  console.time("Greedy Time");
  let result = selectTasksGreedy(edgeCaseTasks);
  console.timeEnd("Greedy Time");
  console.log("Selected Tasks:", result.length);
}

// 1. All tasks overlapping (All start at 1, end at 10)
let allOverlapping = [];
for (let i = 0; i < 1000; i++) {
  allOverlapping.push({ start: 1, end: 10 });
}
runStressTest("All Tasks Overlapping", allOverlapping); // Expects exactly 1 selected task

// 2. All tasks non-overlapping (Sequential)
let allNonOverlapping = [];
for (let i = 0; i < 1000; i++) {
  allNonOverlapping.push({ start: i * 2, end: i * 2 + 1 });
}
runStressTest("All Tasks Non-Overlapping", allNonOverlapping); // Expects 1000 selected tasks

// 3. Same Start or End Times
let sameTimes = [
  { start: 1, end: 5 },
  { start: 1, end: 3 },
  { start: 1, end: 4 },
  { start: 3, end: 6 },
  { start: 3, end: 6 }
];
runStressTest("Same Start or End Times", sameTimes);