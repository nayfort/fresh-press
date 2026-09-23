import { useId } from 'react';
import PropTypes from 'prop-types';

export default function Field({ label, hint, ...input }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...input}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}
Field.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
};
