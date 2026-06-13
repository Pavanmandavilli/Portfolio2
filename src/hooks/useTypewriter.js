import { useState, useEffect, useRef } from 'react';

const useTypewriter = (words, typingSpeed = 90, deletingSpeed = 50, pauseTime = 2200) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];

    const tick = () => {
      if (!isDeleting) {
        const next = currentWord.substring(0, displayText.length + 1);
        setDisplayText(next);
        if (next === currentWord) {
          timerRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      } else {
        const next = currentWord.substring(0, displayText.length - 1);
        setDisplayText(next);
        if (next === '') {
          setIsDeleting(false);
          setWordIndex(i => (i + 1) % words.length);
        }
      }
    };

    timerRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timerRef.current);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
};

export default useTypewriter;
