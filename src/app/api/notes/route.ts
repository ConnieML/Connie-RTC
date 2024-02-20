import { NextRequest } from 'next/server';

// Test Data
const test_notes = [
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2012-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '4567',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2012-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'this is a test note',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '4567',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2019-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['meeting', 'work', 'important'],
  },
  {
    clientId: '12345',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['important'],
  },
  {
    clientId: '4567',
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    author: 'William Smith',
    callDate: '2011-10-05T14:48:00.000Z',
    callDuration: '13 min 20 sec',
    dateCreated: '2011-10-05T14:48:00.000Z',
    dateUpdated: '2011-10-05T14:48:00.000Z',
    content: 'moved to germany, mobility issues',
    labels: ['important'],
  },
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const client: string = searchParams.get('clientId') ?? '';

  // TODO implement fetch from external data source api used for notes

  return Response.json(test_notes.filter((n) => n.clientId === client));
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const client: string = searchParams.get('clientId') ?? '';

  // TODO add the note to the data source
  // const resp = await...

  const resp = { id: '1234' };
  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id: string = searchParams.get('id') ?? '';

  // TODO delete from data source
  // const resp = await...
  return new Response('Success', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
