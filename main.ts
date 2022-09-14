import { startService } from './start-service';

let index = 0;
const farms: any[] = [];

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
