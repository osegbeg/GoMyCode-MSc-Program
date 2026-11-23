/**
 * Utility helper to pause execution for a given number of milliseconds.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulated API fetch helper.
 * Resolves with mock payload after `latencyMs`, or rejects if `shouldFail` is true.
 */
function simulatedApiFetch(endpoint, latencyMs = 800, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Network error: Failed to fetch from ${endpoint} (503 Service Unavailable)`));
      } else {
        resolve({
          endpoint,
          status: 200,
          timestamp: new Date().toISOString(),
          data: `Payload from ${endpoint}`,
        });
      }
    }, latencyMs);
  });
}

// ============================================================================
// Task 01: Iterating with Async/Await
// ============================================================================
async function iterateWithAsyncAwait(values) {
  console.log("\n=== Task 01: Iterating with Async/Await (1s delay) ===");
  for (const value of values) {
    await delay(1000);
    console.log(`Logged value: ${value}`);
  }
}

// ============================================================================
// Task 02 & Task 03 (Part A): Awaiting a Call & Graceful Error Handling
// ============================================================================
async function awaitCall(endpoint = "/api/v1/users", shouldFail = false) {
  console.log(`\n=== Task 02/03: Awaiting API Call (${endpoint}, shouldFail=${shouldFail}) ===`);
  try {
    const response = await simulatedApiFetch(endpoint, 1000, shouldFail);
    console.log("API Response received:", response);
    return response;
  } catch (error) {
    console.error(
      `[User-Friendly Error]: Unable to retrieve data right now. Please try again later. (${error.message})`
    );
    return null;
  }
}

// ============================================================================
// Task 03 (Part B): Chaining Async/Await
// ============================================================================
async function stepOne() {
  await delay(1000);
  console.log("Step 1 complete: Authenticated user session.");
}

async function stepTwo() {
  await delay(1000);
  console.log("Step 2 complete: Loaded user profile & permissions.");
}

async function stepThree() {
  await delay(1000);
  console.log("Step 3 complete: Rendered dashboard workspace.");
}

async function chainedAsyncFunctions() {
  console.log("\n=== Task 03 (Part B): Chaining Async Functions Sequentially ===");
  await stepOne();
  await stepTwo();
  await stepThree();
}

// ============================================================================
// Task 04: Awaiting Concurrent Requests
// ============================================================================
async function concurrentRequests() {
  console.log("\n=== Task 04: Awaiting Concurrent Requests (Promise.all) ===");
  const [profileResponse, notificationsResponse] = await Promise.all([
    simulatedApiFetch("/api/v1/profile", 1200),
    simulatedApiFetch("/api/v1/notifications", 900),
  ]);

  console.log("Combined Concurrent Results:", {
    profile: profileResponse.data,
    notifications: notificationsResponse.data,
  });
}

// ============================================================================
// Task 05: Awaiting Parallel Calls
// ============================================================================
async function parallelCalls(urls) {
  console.log("\n=== Task 05: Awaiting Parallel Calls across URLs ===");
  const fetchPromises = urls.map((url, index) =>
    simulatedApiFetch(url, 600 + index * 200)
  );

  const responses = await Promise.all(fetchPromises);
  console.log("All Parallel Responses Complete:");
  responses.forEach((res) => console.log(` - [${res.status}] ${res.endpoint}: ${res.data}`));
}

// ============================================================================
// Sequential Runner for Demonstration
// ============================================================================
async function runAllTasks() {
  await iterateWithAsyncAwait(["Alpha", "Beta", "Gamma"]);
  await awaitCall("/api/v1/orders", false); // Task 02 success case
  await awaitCall("/api/v1/orders", true);  // Task 03 graceful error handling
  await chainedAsyncFunctions();
  await concurrentRequests();
  await parallelCalls([
    "https://api.example.com/posts",
    "https://api.example.com/comments",
    "https://api.example.com/albums",
  ]);
  console.log("\nAll asynchronous tasks completed successfully!");
}

runAllTasks();