import dynamic from 'next/dynamic';

const useSpeechToText = dynamic(
    () => import('react-hook-speech-to-text'),
    { ssr: false }
);

export default useSpeechToText