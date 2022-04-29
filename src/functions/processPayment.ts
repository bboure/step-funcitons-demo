import { SQSHandler } from 'aws-lambda';
import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand,
} from '@aws-sdk/client-sfn';
import axios from 'axios';

const client = new SFNClient({});

export const handler: SQSHandler = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  console.log(body);

  const { data } = await axios.post('https://eon5fen6k32sh7l.m.pipedream.net', {
    body: body.order,
  });

  console.log({ data });
  if (data.status === 'Success') {
    await client.send(
      new SendTaskSuccessCommand({
        taskToken: body.token,
        output: JSON.stringify({
          status: 'Success',
        }),
      }),
    );
  } else {
    await client.send(
      new SendTaskFailureCommand({
        taskToken: body.token,
        error: 'PaymentFailed',
        cause: 'The payment failed',
      }),
    );
  }
};
