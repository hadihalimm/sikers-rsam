import { createFormHookContexts, createFormHook } from '@tanstack/react-form';
import TextField from './text-field';
import SubmitButton from './submit-button';
import TextAreaField from './text-area-field';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, TextAreaField },
  formComponents: { SubmitButton },
});
