export class EventBus {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(eventType, observer) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(observer);
  }

  publish(eventType, payload) {
    const observers = this.subscribers.get(eventType) || [];
    for (const observer of observers) {
      observer.update(payload);
    }
  }
}