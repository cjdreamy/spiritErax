import { AuthManager } from '@/lib/auth';

interface AvatarProps {
  fullName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export function Avatar({ fullName, size = 'md', className = '', showIcon = false }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  // If no fullName or showIcon is true, show SVG icon
  if (!fullName || showIcon) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-gray-200 
          text-gray-600 
          flex items-center justify-center 
          border-2 border-gray-300
          ${className}
        `}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={size === 'sm' ? '16' : size === 'md' ? '20' : '24'} 
          height={size === 'sm' ? '16' : size === 'md' ? '20' : '24'} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    );
  }

  const initials = AuthManager.getUserInitials(fullName);
  
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
