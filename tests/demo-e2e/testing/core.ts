import { Coverage } from '@playwright/test';

export type CoverageEntry = Awaited<ReturnType<Coverage['stopJSCoverage']>>[0];
