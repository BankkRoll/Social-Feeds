import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

const fonts = [
    { value: "Arial", label: "Arial" },
    { value: "Verdana", label: "Verdana" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Courier New", label: "Courier New" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "Lucida Sans Unicode", label: "Lucida Sans Unicode" },
    { value: "Impact", label: "Impact" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
    { value: "Palatino Linotype", label: "Palatino Linotype" },
    { value: "Sylfaen", label: "Sylfaen" },
    { value: "Consolas", label: "Consolas" },
    { value: "Franklin Gothic Medium", label: "Franklin Gothic Medium" },
    { value: "Gill Sans", label: "Gill Sans" },
    { value: "Century Gothic", label: "Century Gothic" },
    { value: "Lucida Console", label: "Lucida Console" },
    { value: "Bookman Old Style", label: "Bookman Old Style" },
    { value: "Garamond", label: "Garamond" },
    { value: "MS Sans Serif", label: "MS Sans Serif" },
    { value: "MS Serif", label: "MS Serif" },
    { value: "Symbol", label: "Symbol" },
    { value: "Webdings", label: "Webdings" },
    { value: "Wingdings", label: "Wingdings" },
    { value: "Book Antiqua", label: "Book Antiqua" }
];


interface FontComboboxProps {
  selectedFont: string;
  setSelectedFont: React.Dispatch<React.SetStateAction<string>>;
}

export function FontCombobox({ selectedFont, setSelectedFont }: FontComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          style={{ fontFamily: selectedFont }}
        >
          {selectedFont ? selectedFont : "Select Font"}
          <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Font..." />
          <CommandEmpty>No font found.</CommandEmpty>
          <CommandGroup>
            {fonts.map((font) => (
              <CommandItem
                key={font.value}
                onSelect={(value) => {
                  setSelectedFont(value === selectedFont ? "" : value);
                  setOpen(false);
                }}
                style={{ fontFamily: font.value }}
              >
                {font.label}
                <CheckIcon
                  className={`ml-auto h-4 w-4 ${selectedFont === font.value ? "opacity-100" : "opacity-0"}`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}