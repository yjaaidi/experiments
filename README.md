## 1. Run e2e tests

```sh
nx e2e
```

## 2.a. Produce coverage reports with MCR

MCR produces better results as it fixes known issues in `v8-to-istanbul` (cf. https://github.com/vitest-dev/vitest/issues/4993#issuecomment-1913429019)

```sh
nx report-mcr
```

## 2.b. Produce coverage reports with istanbul tools

```sh
nx report-istanbul
```

## 2.c. Produce coverage reports with C8

```sh
nx report-c8
```

⚠️ The source code is not mapped properly with this option due to the following issue: https://github.com/bcoe/c8/issues/339
