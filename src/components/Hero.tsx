import React from 'react';

interface HeroProps {
  totalProducts?: number;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-8 sm:pt-12 sm:pb-10 border-b border-stone-200 dark:border-stone-800 bg-radial from-amber-50/40 via-stone-50 to-stone-100 dark:from-stone-900/40 dark:via-stone-950 dark:to-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Title in Classic Arabic Serif */}
          <h1 className="font-classic text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.2]">
            منارة المسلم
          </h1>
        </div>
      </div>
    </section>
  );
};
