export class Subscription {
  constructor() {
      this.tearDowns = [];
  }
  add(tearDown) {
      this.tearDowns.push(tearDown);
  }
  unsubscribe() {
      for (const teardown of this.tearDowns) {
          teardown();
      }
      this.tearDowns = [];
  }
}
class Subscriber {
  constructor(observer, subscription) {
      this.observer = observer;
      this.closed = false;
      subscription.add(() => (this.closed = true));
  }
  next(value) {
      if (!this.closed) {
          this.observer.next(value);
      }
  }
}
export default class Subject {
  constructor() {
      this.observers = [];
  }
  next(value) {
      for (const observer of this.observers) {
          observer.next(value);
      }
  }
  subscribe(observer) {
      const subscription = new Subscription();
      const subscriber = new Subscriber(observer, subscription);
      this.observers.push(subscriber);
      return subscription;
  }
  unsubscribe() {
      this.observers = [];
  }
}