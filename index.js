import { startService } from './start-service.js';

let index = 0;
const farms = [];

startService({
  spec: './openapi.yaml',
  handlers: {
    createFarm(req, res) {
      const farm = {
        id: (index++).toString(),
        ...req.body,
      };
      farms.push(farm);
      res.status(201).send(farm);
    },
    getFarms(req, res) {
      res.send(farms);
    },
  },
});
