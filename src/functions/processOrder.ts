import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  console.log({ event });
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
