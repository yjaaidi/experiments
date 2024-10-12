export async function browserStep(fn: () => Promise<void>) {
  if (isRunningInPlaywright()) {
    return;
  }
  await fn();
}

function isRunningInPlaywright() {
  return '_playwrightInstance' in globalThis;
}

export let _currentTestName: string | undefined;
export let _currentStepIndex: number | undefined;
