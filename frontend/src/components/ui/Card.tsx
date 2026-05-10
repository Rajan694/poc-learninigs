import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn('glass-card p-6', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
