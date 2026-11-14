import React from 'react';
import {
  Calculator,
  BookMarked,
  BookOpenText,
  Atom,
  FlaskConical,
  Leaf,
  Languages,
  Compass,
  Cpu,
  Shield,
  HeartHandshake,
  Sun,
  Wrench,
  Music,
  Palette,
  Dumbbell,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function SubjectIcon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'Calculator': return <Calculator className={className} />;
    case 'BookMarked': return <BookMarked className={className} />;
    case 'BookOpenText': return <BookOpenText className={className} />;
    case 'Atom': return <Atom className={className} />;
    case 'FlaskConical': return <FlaskConical className={className} />;
    case 'Leaf': return <Leaf className={className} />;
    case 'Languages': return <Languages className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Music': return <Music className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Dumbbell': return <Dumbbell className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    default: return <BookOpen className={className} />;
  }
}
