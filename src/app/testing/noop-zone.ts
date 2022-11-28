/* @hack use a dummy zone implementation because Angular TestBed
 * manually instantiates NgZone.
 * This could be quickly fixed. */
class NoopZone {
  static root = new NoopZone();
  static current = NoopZone.root;
  static currentTask = null;
  /* This is used by TestBed's teardown. */
  static fakeAsyncTest = {
    resetFakeAsyncZone() {},
  };

  static assertZonePatched() {
    return true;
  }

  static __load_patch() {}

  static __symbol__(name: string) {
    return name;
  }

  fork() {
    return this;
  }

  run(callback: Function, applyThis?: any, applyArgs?: any[]) {
    return callback.apply(applyThis, applyArgs);
  }
}

(globalThis as any).Zone = NoopZone;
