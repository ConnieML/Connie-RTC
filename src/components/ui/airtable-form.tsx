import React from 'react';
import * as Form from '@radix-ui/react-form';

export default ({ onSubmit, label }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void, label: string }) => (
  <Form.Root onSubmit={onSubmit}>
    <Form.Field name="token">
      <Form.Label>Airtable Token</Form.Label>
      <Form.Control>
        <input type="text" required />
      </Form.Control>
    </Form.Field>

    <Form.Submit />
  </Form.Root>
);