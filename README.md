## Coverage with C8

```sh
nx e2e demo-e2e --skip-nx-cache
bun c8 report -r html -r text
```

⚠️ The source code is not mapped properly with this option due to the following issue: https://github.com/bcoe/c8/issues/339
