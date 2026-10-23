import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/80 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 font-classic">
          منارة المسلم . جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};
