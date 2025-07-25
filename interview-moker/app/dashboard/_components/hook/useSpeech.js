import dynamic from 'next/dynamic';

const useSpeechToText = dynamic(
    () => import('react-hook-speech-to-text'),
    { ssr: false }
);

export default useSpeechToText
// /app/_components/hook/useSpeech.js
// export { default } from 'react-hook-speech-to-text';