import React from 'react';
import { Calculator, BookMarked, Atom, Languages, Compass, Cpu, Shield, Wrench, BookOpen } from 'lucide-react';

export function SubjectIcon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'Calculator': return <Calculator className={className} />;
    case 'BookMarked': return <BookMarked className={className} />;
    case 'Atom': return <Atom className={className} />;
    case 'Languages': return <Languages className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    default: return <BookOpen className={className} />;
  }
}
