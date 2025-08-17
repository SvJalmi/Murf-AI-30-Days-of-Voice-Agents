import { useState, useRef, useCallback } from 'react';
import { RecordingState } from '../types';

const AUDIO_TIMESLICE_MS = 250; // Send audio chunks every 250ms

export const useAudioRecorder = (
  onDataAvailable: (chunk: Blob) => void,
  onError: (message: string) => void
) => {
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setAudioStream(null);
    setRecordingState(RecordingState.STOPPED);
  }, []);

  const startRecording = useCallback(async () => {
    setRecordingState(RecordingState.PREPARING);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.warn('Recording is already in progress.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setAudioStream(stream);

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onDataAvailable(event.data);
        }
      };

      recorder.onstop = () => {
        // The stopRecording function already handles state and stream cleanup.
        console.log('MediaRecorder stopped.');
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError('An error occurred with the media recorder.');
        stopRecording();
      };
      
      recorder.start(AUDIO_TIMESLICE_MS);
      setRecordingState(RecordingState.RECORDING);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              onError('Microphone permission denied. Please allow access in your browser settings.');
          } else {
              onError(`Could not start recording: ${err.message}`);
          }
      }
      setRecordingState(RecordingState.IDLE);
      setAudioStream(null);
      throw err; // re-throw to be caught in the component
    }
  }, [onDataAvailable, onError, stopRecording]);

  return { recordingState, startRecording, stopRecording, audioStream };
};
