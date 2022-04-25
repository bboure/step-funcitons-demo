import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const run = async () => {
  const client = new SFNClient({});
  const prefix = new Date().getTime();

  await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      return client.send(
        new StartExecutionCommand({
          name: `${prefix}-order${i}`,
          stateMachineArn:
            'arn:aws:states:us-east-2:379730309663:stateMachine:process-queue',
          input: JSON.stringify({
            order: {
              id: i,
              items: [
                { name: 'pen', price: 1, quantity: 2 },
                { name: 'posti-ts', price: 2, quantity: 1 },
                { name: 'stapler', price: 6, quantity: 1 },
              ],
            },
          }),
        }),
      );
    }),
  );
};

run().then(() => {
  console.log('Done');
});
