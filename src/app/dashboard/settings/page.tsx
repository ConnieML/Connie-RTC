'use client';

import React from 'react';

import SingleForm from '@/components/ui/single-form';

const Page = () => {
  const AIRTABLE_TOKEN_STR = 'Airtable Token';
  const AIRTABLE_BASE_ID_STR = 'Airtable Base ID';
  const AIRTABLE_TABLE_ID_STR = 'Airtable Table ID';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const airtableToken = formData.get(AIRTABLE_TOKEN_STR);
    const airtableBaseId = formData.get(AIRTABLE_BASE_ID_STR);
    const airtableTableId = formData.get(AIRTABLE_TABLE_ID_STR);

    try {
      const response = await fetch('../api/crmconfig/airtable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: airtableToken,
          baseId: airtableBaseId,
          tableId: airtableTableId,
        }),
      });
      // Handle the response
    } catch (error) {
      // Handle the error
    }
  };

  const fields = [
    {
      name: AIRTABLE_TOKEN_STR,
      label: AIRTABLE_TOKEN_STR,
    },
    {
      name: AIRTABLE_BASE_ID_STR,
      label: AIRTABLE_BASE_ID_STR,
    },
    {
      name: AIRTABLE_TABLE_ID_STR,
      label: AIRTABLE_TABLE_ID_STR,
    },
  ];

  return (
    <div>
      <SingleForm onSubmit={onSubmit} fields={fields} />
    </div>
  );
};

export default Page;
