"use client";

import { useState } from "react";

export function CharCountTextarea({
  name,
  defaultValue,
  maxLength,
  required,
  rows = 3,
  className,
}: {
  name: string;
  defaultValue?: string;
  maxLength: number;
  required?: boolean;
  rows?: number;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div>
      <textarea
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={maxLength}
        required={required}
        rows={rows}
        className={className}
      />
      <p className="mt-1 text-right text-xs text-muted">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
