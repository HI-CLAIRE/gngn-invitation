import { IMAGES } from '../../config/images';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function SpeechBubble({ children, className = '' }: Props) {
  return (
    <div className={`speech-bubble ${className}`.trim()} role="region" aria-live="polite">
      <img src={IMAGES.speechBubble} alt="" className="speech-bubble__bg" aria-hidden />
      <div className="speech-bubble__text">{children}</div>
    </div>
  );
}
