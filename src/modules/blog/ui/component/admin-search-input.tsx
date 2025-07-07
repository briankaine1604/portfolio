import { memo } from "react";

export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search blog posts..."
      value={value}
      onChange={onChange}
      className="border-2 border-black px-4 py-2 font-mono w-full"
    />
  );
});
