import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NewNote, NoteTag } from '../../types/note';

interface NoteFormProps {
  onSuccess: () => void;

}


const tagOptions: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<NoteTag>().oneOf(tagOptions).required('Tag is required'),
});



export default function NoteForm({ onSuccess }: NoteFormProps) {
  
  const queryClient = useQueryClient();

  const handleSubmit = async (values: NewNote) => {
    try {
      await createNote(values); // токен береться в середині noteService
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
      console.error('Create note error:', errorMessage);
      alert(`⚠️ Failed to create note: ${errorMessage}`);
    }
  };

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {tagOptions.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" onClick={onSuccess} className={css.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={css.submitButton}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}