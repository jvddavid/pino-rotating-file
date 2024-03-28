# Rotating File Transport for Pino

A transport to rotate files with a max size.

## Install

```bash
npm i @jvddavid/pino-rotating-file
```

## Use

A example with the path of folder is ./logs and the max write in file is 10mb and the name of first file is ./logs/log-2024-01-01-23-59-59-999-000.log

```javascript
const pino = require("pino");

const transport = pino.transport({
  target: "@jvddavid/pino-rotating-file",
  options: {
    path: "logs",
    pattern: "log-%Y-%M-%d-%H-%m-%s-%l-%N.log",
    maxSize: 1024 * 1024 * 10,
    sync: false,
    fsync: false,
    append: true,
    mkdir: true,
  },
});

pino(transport);
```
