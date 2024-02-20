"use client";

import React from "react";
import * as Form from "@radix-ui/react-form";

interface SingleFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  fields: { name: string; label: string }[];
}

const SingleForm = ({ onSubmit, fields }: SingleFormProps) => {
  return (
    <Form.Root onSubmit={onSubmit}>
      {fields.map((field) => (
        <Form.Field key={field.name} name={field.name}>
          <Form.Label>{field.label}</Form.Label>
          <Form.Control type="text" required />
        </Form.Field>
      ))}
      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  );
};

export default SingleForm;

export type { SingleFormProps };
