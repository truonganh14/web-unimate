import { Link } from 'react-router';
import logo1B from '../../assets/unimate-logo-dark.png';
import mascot from '../../assets/unimate-robot-fullbody-ver2.png';

const sizeClasses = {
  sm: 'h-24',
  md: 'h-28 sm:h-32',
  lg: 'h-36 sm:h-44',
  xl: 'h-52 sm:h-60',
} as const;

type UnimateLogoProps = {
  size?: keyof typeof sizeClasses;
  className?: string;
  asLink?: boolean;
  onClick?: () => void;
  center?: boolean;
  mascotOnly?: boolean;
};

export function UnimateAvatar({ className = '' }: { className?: string }) {
  return (
    <img
      src={mascot}
      alt=""
      aria-hidden
      className={`h-full w-full object-contain ${className}`}
    />
  );
}

export function UnimateLogo({
  size = 'md',
  className = '',
  asLink = false,
  onClick,
  center = false,
  mascotOnly = false,
}: UnimateLogoProps) {
  const src = mascotOnly ? mascot : logo1B;
  const widthClass = mascotOnly ? 'max-w-[min(100%,11rem)]' : 'max-w-[min(100%,16rem)]';

  const image = (
    <img
      src={src}
      alt="Unimate"
      className={`w-auto ${widthClass} object-contain ${center ? 'mx-auto' : ''} ${sizeClasses[size]} ${className}`}
    />
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-flex shrink-0 min-w-0" onClick={onClick}>
        {image}
      </Link>
    );
  }

  return image;
}
