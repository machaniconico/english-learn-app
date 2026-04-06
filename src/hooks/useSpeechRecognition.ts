import { useCallback, useRef, useState } from 'react';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  function createRecognition() {
    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return null;
    }
    const recognition = new (SpeechRecognition as new () => {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onresult: (e: SpeechRecognitionEvent) => void;
      onerror: (e: SpeechRecognitionErrorEvent) => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    })();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  }

  const startListening = useCallback(() => {
    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setTranscript('');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    setListening(true);
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { startListening, stopListening, listening, transcript, supported };
}
