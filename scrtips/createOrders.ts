import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { faker } from '@faker-js/faker';
import chunk from 'lodash/chunk';
import sumBy from 'lodash/sumBy';

const run = async () => {
  const client = new SFNClient({});
  const prefix = new Date().getTime();
  console.log('Starting SF');

  const orders = Array.from({ length: 50 }).map((_, i) => {
    const items = [
      {
        name: faker.commerce.product(),
        price: faker.datatype.float({ min: 10, max: 100, precision: 2 }),
        quantity: 1,
      },
      {
        name: faker.commerce.product(),
        price: faker.datatype.float({ min: 10, max: 100, precision: 2 }),
        quantity: 1,
      },
      {
        name: faker.commerce.product(),
        price: faker.datatype.float({ min: 10, max: 100, precision: 2 }),
        quantity: 1,
      },
    ];
    return {
      order: {
        id: i,
        items,
        total: sumBy(items, 'price'),
      },
    };
  });

  const chunks = chunk(orders, 10);
  const start = Date.now();
  for (const batch of chunks) {
    console.log('Creating batch of 10 orders');
    await Promise.all(
      batch.map((payload) => {
        return client.send(
          new StartExecutionCommand({
            name: `${prefix}-order${payload.order.id}`,
            stateMachineArn:
              'arn:aws:states:us-east-2:379730309663:stateMachine:process-payment',
            input: JSON.stringify(payload),
          }),
        );
      }),
    );
  }
  console.log(`Done in ${(Date.now() - start) / 1000} sec`);
};

run()
  .then(() => {
    console.log('Done');
  })
  .catch(console.error);
