/* @hack use a dummy zone implementation because Angular TestBed
 * manually instantiates NgZone.
 * This could be quickly fixed. */
class NoopZone {
  static root = new NoopZone();
  static current = this.root;
  static currentTask = null;
  static ProxyZoneSpec = this.root;
  /* This is used by TestBed's teardown. */
  static fakeAsyncTest = this.root;

  static assertZonePatched() {
    return true;
  }

  static __load_patch() {}

  static __symbol__(name: string) {
    return name;
  }

  get() {
    return this;
  }

  fork() {
    return this;
  }

  run(callback: Function, applyThis?: any, applyArgs?: any[]) {
    return callback.apply(applyThis, applyArgs);
  }

  onHasTask(callback: Function, applyThis?: any, applyArgs?: any[]) {
    return callback.apply(applyThis, applyArgs);
  }

  flush() {}

  assertPresent() {
    return NoopZone.root;
  }

  resetFakeAsyncZone() {}
}

(globalThis as any).Zone = NoopZone;
