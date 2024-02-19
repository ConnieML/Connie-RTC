'use client';

import React from 'react';
import SingleForm from '@/components/ui/single-form';

const Page = () => {
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const field = formData.get('Airtable Token');
        console.log(field)


        try {
            const response = await fetch('../api/crmconfig/airtable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: field }),
            });
            // Handle the response
        } catch (error) {
            // Handle the error
        }
    };

    return (
        <div>
            <SingleForm onSubmit={onSubmit} formField="Airtable Token" formLabel="Airtable Token"/>
        </div>
    );
};

export default Page;
