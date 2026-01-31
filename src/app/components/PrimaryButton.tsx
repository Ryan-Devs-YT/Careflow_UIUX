import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  mode?: 'simplified' | 'balanced';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function PrimaryButton({
  children,
  onClick,
  variant = 'primary',
  mode = 'simplified',
  fullWidth = false,
  disabled = false,
  type = 'button',
}: PrimaryButtonProps) {
  const isSimplified = mode === 'simplified';
  const height = isSimplified ? 'h-[60px]' : 'h-[48px]';
  const padding = isSimplified ? 'px-8' : 'px-6';
  const textSize = isSimplified ? 'text-lg' : 'text-sm';

  const baseStyles = `
    ${height}
    ${padding}
    ${fullWidth ? 'w-full' : 'min-w-[280px]'}
    ${textSize}
    rounded-xl
    font-medium
    transition-all duration-150
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  `;

  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseStyles}
          bg-healing-sage-500 text-white
          hover:bg-healing-sage-600 hover:shadow-md
          active:bg-healing-sage-700 active:shadow-sm
          disabled:bg-neutral-300 disabled:text-neutral-500
        `}
      >
        {children}
      </button>
    );
  }

  // Secondary variant
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        bg-transparent text-healing-sage-600
        border-2 border-healing-sage-500
        hover:bg-healing-sage-100
        active:bg-healing-sage-200
        disabled:border-neutral-300 disabled:text-neutral-400
      `}
    >
      {children}
    </button>
  );
}
