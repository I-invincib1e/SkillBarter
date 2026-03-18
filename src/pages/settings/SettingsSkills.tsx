import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input, Button } from '../../components/ui';

interface SettingsSkillsProps {
  skillsOffered: string[];
  skillsWanted: string[];
  onChangeOffered: (skills: string[]) => void;
  onChangeWanted: (skills: string[]) => void;
}

function SkillChips({
  skills,
  variant,
  onRemove,
}: {
  skills: string[];
  variant: 'offered' | 'wanted';
  onRemove: (skill: string) => void;
}) {
  const colors = variant === 'offered'
    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
    : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300';

  const hoverColors = variant === 'offered'
    ? 'hover:bg-primary-200 dark:hover:bg-primary-800/50'
    : 'hover:bg-warning-200 dark:hover:bg-warning-800/50';

  if (skills.length === 0) {
    return (
      <p className="text-xs text-gray-400 py-2">
        No skills added yet. Type a skill name and press Enter.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${colors}`}
        >
          {skill}
          <button
            type="button"
            onClick={() => onRemove(skill)}
            className={`p-0.5 rounded-sm transition-colors ${hoverColors}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

function SkillInput({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (skill: string) => void;
}) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <Button variant="secondary" onClick={handleAdd} disabled={!value.trim()}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function SettingsSkills({
  skillsOffered,
  skillsWanted,
  onChangeOffered,
  onChangeWanted,
}: SettingsSkillsProps) {
  const addOffered = (skill: string) => {
    if (!skillsOffered.includes(skill)) {
      onChangeOffered([...skillsOffered, skill]);
    }
  };

  const removeOffered = (skill: string) => {
    onChangeOffered(skillsOffered.filter((s) => s !== skill));
  };

  const addWanted = (skill: string) => {
    if (!skillsWanted.includes(skill)) {
      onChangeWanted([...skillsWanted, skill]);
    }
  };

  const removeWanted = (skill: string) => {
    onChangeWanted(skillsWanted.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1">
          Skills I Offer
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Skills you can teach or help others with
        </p>
        <SkillChips skills={skillsOffered} variant="offered" onRemove={removeOffered} />
        <div className="mt-3">
          <SkillInput placeholder="Add a skill you offer..." onAdd={addOffered} />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-dark-border pt-8">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1">
          Skills I Want to Learn
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Skills you are looking to learn from others
        </p>
        <SkillChips skills={skillsWanted} variant="wanted" onRemove={removeWanted} />
        <div className="mt-3">
          <SkillInput placeholder="Add a skill you want to learn..." onAdd={addWanted} />
        </div>
      </div>
    </div>
  );
}
