import { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
  console.log({ event });
};
