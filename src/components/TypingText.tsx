import { useEffect, useState, useRef } from "react";

interface TypingTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const TypingText = ({
  texts,
  className = "",
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypingTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const currentFullText = texts[textIndex];

    const type = () => {
      if (isWaiting) {
        timeoutRef.current = setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      if (isDeleting) {
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        } else {
          timeoutRef.current = setTimeout(() => {
            setDisplayText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (displayText.length === currentFullText.length) {
          setIsWaiting(true);
        } else {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(currentFullText.slice(0, displayText.length + 1));
          }, typingSpeed);
        }
      }
    };

    type();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, isWaiting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
};

export default TypingText;
