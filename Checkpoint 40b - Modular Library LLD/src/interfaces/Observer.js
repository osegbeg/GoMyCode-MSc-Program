export class Observer {
  update(eventPayload) {
    throw new Error("Method 'update(eventPayload)' must be implemented by concrete observers.");
  }
}