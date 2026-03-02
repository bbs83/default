/* ============================================================
   Loading Spinner — reusable spinner component
   ============================================================ */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-gold/30 border-t-gold rounded-full spinner`}
      />
      {message && (
        <p className="text-gray-500 text-sm text-center">{message}</p>
      )}
    </div>
  );
}
