# Asynchronous Programming in JavaScript (`async` / `await` & `Promise.all`)

This checkpoint demonstrates asynchronous control flow patterns in Node.js using `async`/`await`, `try`/`catch` error handling, and concurrent execution with `Promise.all()`.

## Implemented Tasks
1. **Task 01 (`iterateWithAsyncAwait`):** Iterates through an array sequentially using a `for...of` loop and a Promise-based `1000ms` delay between logs.
2. **Task 02 (`awaitCall`):** Simulates an asynchronous API call and awaits its resolved payload.
3. **Task 03 (`awaitCall` Error Handling & `chainedAsyncFunctions`):** Wraps API calls in `try/catch` to display user-friendly error messages on failure, and chains three 1-second async steps sequentially.
4. **Task 04 (`concurrentRequests`):** Executes two independent API requests concurrently with `Promise.all()` and logs the combined result.
5. **Task 05 (`parallelCalls`):** Maps an array of URLs into concurrent fetch promises and awaits all responses simultaneously via `Promise.all()`.

## Running the Code
```bash
node asyncTasks.js