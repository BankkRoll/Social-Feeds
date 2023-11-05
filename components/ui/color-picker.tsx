import React, { useRef } from "react";

interface CircularColorPickerProps {
  value: string;
  onChange: (newColor: string) => void;
}

const CircularColorPicker: React.FC<CircularColorPickerProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    inputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onChange(newColor);
  };

  return (
    <div className="relative p-2 inline-block">
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={handleColorChange}
        className="absolute opacity-0 w-full h-full cursor-pointer"
      />
      <div
        className="w-9 h-9 rounded-full outline outline-2 cursor-pointer"
        style={{ backgroundColor: value }}
        onClick={handleDivClick}
      ></div>
    </div>
  );
};

export { CircularColorPicker };
