'use client';

import React from 'react';
import * as Form from '@radix-ui/react-form';

/**
 * Should take in the name of the field
 * As well as the callback to submission
 */

interface SingleFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    formField: string;
    formLabel: string;
}

const SingleForm = ({ onSubmit, formField, formLabel }: SingleFormProps) => {
    return (
        <Form.Root onSubmit={onSubmit}>
            <Form.Field name={formField}>
                <Form.Label>{formLabel}</Form.Label>
                <Form.Control type="text" required />

            </Form.Field>
            <Form.Submit>Submit</Form.Submit>
        </Form.Root>
    );
};

export default SingleForm;
