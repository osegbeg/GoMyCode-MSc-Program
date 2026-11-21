# React Developer Tools Debugging Report

## 1. Environment & Setup
- Built a multi-component React application (`App`, `UserProfile`, `TaskList`, `CounterPanel`) passing props and managing local state via `useState`.
- Installed the **React Developer Tools** extension in Google Chrome and inspected the live component hierarchy under the **Components** tab.

## 2. Issues Identified & Resolved

### Issue 1: Missing & Mismatched Props in `UserProfile`
- **Symptom:** The username and account status fields rendered blank on the UI.
- **DevTools Diagnosis:** Selecting `<UserProfile>` in the Components tree revealed `props.userName = "Golden-Joe"` (camelCase mismatch) while `username` and `status` were `undefined`.
- **Fix:** Updated `<UserProfile>` in `App.js` to pass `username="Golden-Joe"` and `status="Active"`.

### Issue 2: Undefined Initial State in `TaskList`
- **Symptom:** Application threw a runtime `TypeError` when reading `tasks.length`.
- **DevTools Diagnosis:** Inspecting `<TaskList>` showed `props.tasks` was passed instead of `props.initialTasks`, leaving `hooks.State` initialized as `undefined`.
- **Fix:** Renamed the prop in `App.js` to `initialTasks={sampleTasks}` and added a default parameter (`initialTasks = []`) in `TaskList.js`.

### Issue 3: Direct State Mutation Preventing Re-render in `TaskList`
- **Symptom:** Submitting a new task did not update the rendered list on screen.
- **DevTools Diagnosis:** Inspecting `hooks.State` in `<TaskList>` showed the array length increasing internally via `.push()`, but React skipped re-rendering because the array reference never changed.
- **Fix:** Replaced `tasks.push(...)` with an immutable update: `setTasks([...tasks, newTaskObj])`.

### Issue 4: Wrong Prop Data Type in `CounterPanel`
- **Symptom:** Clicking **Add +5** produced `"05"`, `"055"`, `"0555"` instead of `5`, `10`, `15`.
- **DevTools Diagnosis:** The `<CounterPanel>` props panel displayed `step: "5"` as a string literal rather than a number.
- **Fix:** Changed `step="5"` to `step={5}` in `App.js`.

## 3. Verification
- Verified in React Developer Tools that all component props and `useState` hooks reflect accurate data types and update reactively on user interaction.