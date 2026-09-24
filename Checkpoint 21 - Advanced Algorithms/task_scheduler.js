// 1. Array of Task Objects
let tasks = [
  { name: "Task A", start: 9, end: 11, priority: "High" },
  { name: "Task B", start: 10, end: 12, priority: "Medium" },
  { name: "Task C", start: 13, end: 15, priority: "Low" },
  { name: "Task D", start: 11, end: 14, priority: "High" },
  { name: "Task E", start: 14, end: 16, priority: "Medium" }
];

// 2. Feature 1: Sort tasks by start time
function sortTasksByStartTime(taskList) {
  // Make a copy so we don't mutate the original array directly
  let sortedList = taskList.slice();

  sortedList.sort(function(a, b) {
    return a.start - b.start;
  });

  return sortedList;
}

// 3. Feature 2: Group tasks by priority using a plain JS object (Hash Map)
function groupTasksByPriority(taskList) {
  let priorityMap = {};

  for (let i = 0; i < taskList.length; i++) {
    let task = taskList[i];
    let priority = task.priority;

    // If the priority key doesn't exist yet, create an empty array for it
    if (!priorityMap[priority]) {
      priorityMap[priority] = [];
    }

    // Add task to its priority group
    priorityMap[priority].push(task);
  }

  return priorityMap;
}

// 4. Feature 3: Detect overlapping tasks (using Interval Comparison pattern)
function findOverlappingTasks(taskList) {
  // Step 1: Must sort by start time first to compare adjacent intervals
  let sorted = sortTasksByStartTime(taskList);
  let overlaps = [];

  // Step 2: Compare each task with the next task in line
  for (let i = 0; i < sorted.length - 1; i++) {
    let currentTask = sorted[i];
    let nextTask = sorted[i + 1];

    // Overlap occurs if next task starts before current task ends
    if (nextTask.start < currentTask.end) {
      overlaps.push({
        task1: currentTask.name,
        task2: nextTask.name,
        time: "Overlap between " + nextTask.start + " and " + currentTask.end
      });
    }
  }

  return overlaps;
}

// 5. Optional Feature: Estimate Memory Usage
function estimateMemoryUsage(taskList) {
  let taskCount = taskList.length;
  
  // Approximate estimation:
  // Each task object takes ~100 bytes of overhead in memory (strings, numbers, pointers)
  let bytesPerTask = 100;
  let totalBytes = taskCount * bytesPerTask;
  
  console.log("Total Tasks: " + taskCount);
  console.log("Estimated Memory Usage: ~" + totalBytes + " bytes (" + (totalBytes / 1024).toFixed(2) + " KB)");
}

// ==========================================
// Testing & Output Display
// ==========================================

console.log("=== 1. TASKS SORTED BY START TIME ===");
let sortedTasks = sortTasksByStartTime(tasks);
for (let i = 0; i < sortedTasks.length; i++) {
  let t = sortedTasks[i];
  console.log(t.name + " (" + t.start + ":00 - " + t.end + ":00) - Priority: " + t.priority);
}

console.log("\n=== 2. TASKS GROUPED BY PRIORITY ===");
let groupedTasks = groupTasksByPriority(tasks);
for (let priorityLevel in groupedTasks) {
  console.log("\n[" + priorityLevel + " Priority]:");
  let group = groupedTasks[priorityLevel];
  for (let j = 0; j < group.length; j++) {
    console.log(" - " + group[j].name);
  }
}

console.log("\n=== 3. OVERLAPPING TASKS DETECTED ===");
let overlappingList = findOverlappingTasks(tasks);
if (overlappingList.length === 0) {
  console.log("No overlapping tasks found.");
} else {
  for (let k = 0; k < overlappingList.length; k++) {
    let o = overlappingList[k];
    console.log("Conflict: " + o.task1 + " overlaps with " + o.task2 + " (" + o.time + ")");
  }
}

console.log("\n=== 4. MEMORY USAGE ESTIMATION ===");
estimateMemoryUsage(tasks);