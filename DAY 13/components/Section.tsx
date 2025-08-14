
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps): React.ReactNode {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-100 border-l-4 border-cyan-400 pl-4 mb-6">
        {title}
      </h2>
      <div className="pl-5">
        {children}
      </div>
    </section>
  );
}

export default Section;
