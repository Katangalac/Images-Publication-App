// EditableField.tsx
import React, { ChangeEvent } from "react";

interface EditableFieldProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
}) => {
  return (
    <>
      <label className="mb-2 block text-sm font-semibold">{label}:</label>
      {readOnly ? (
        <span className="ml-2">{value}</span>
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="mb-2 w-full rounded-md border p-2"
          readOnly={readOnly}
        />
      )}
    </>
  );
};

export default EditableField;
