import { useEffect, useState } from "react";

const useDebounce = (input: string, delay: number) => {
  const [text, setText] = useState("");
  const debounce = () => {};
  useEffect(() => {
    const timer = setTimeout(() => {
      setText(input);
    }, delay);
    return () => clearTimeout(timer);
  }, [input, delay]);
  return text;
};
export default useDebounce;
