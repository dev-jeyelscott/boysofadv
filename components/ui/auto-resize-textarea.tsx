"use client";

import { useEffect, useId, useRef } from "react";

type AutoResizeTextareaProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
};

export function AutoResizeTextarea({
  label,
  name,
  placeholder,
  defaultValue,
  required,
}: AutoResizeTextareaProps) {
  const textareaId = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (!ref.current) return;

    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  };

  useEffect(() => {
    resize();
  }, [defaultValue]);

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="text-xs font-black uppercase tracking-widest text-white/50"
      >
        {label}
      </label>

      <textarea
        id={textareaId}
        ref={ref}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onInput={resize}
        rows={1}
        className="
          mt-2
          w-full
          resize-none
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-black
          px-4
          py-3
          text-sm
          text-white
          outline-none
          placeholder:text-white/30
          focus:border-red-600
        "
      />
    </div>
  );
}
