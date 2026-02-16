import { AuthManager } from '@/lib/auth';

interface AvatarProps {
  fullName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ fullName, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const initials = fullName ? AuthManager.getUserInitials(fullName) : 'U';
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-blue-500 to-blue-600 
        text-white 
        flex items-center justify-center 
        font-semibold
        shadow-md
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
