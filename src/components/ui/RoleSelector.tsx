import React from 'react';

export interface RoleSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  error?: string;
}

const AVAILABLE_ROLES = [
  'Director de Arte',
  'Diseñador gráfico',
  'Edición de video',
  'Redactor',
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoles,
  onChange,
  error,
}) => {
  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <label className="text-xs sm:text-sm text-dark-200 mb-2 font-medium tracking-wide">
        Me postulo como
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {AVAILABLE_ROLES.map((role) => {
          const isSelected = selectedRoles.includes(role);
          return (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`w-full h-12 sm:h-14 px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer outline-none focus:outline-none flex items-center justify-center text-center ${
                isSelected
                  ? 'bg-orange-500 border border-orange-500 text-white font-bold shadow-lg shadow-orange-500/25 scale-[1.01]'
                  : 'bg-transparent border border-orange-500 text-white hover:bg-orange-500/[0.04]'
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>
      {error && <span className="mt-1.5 px-3 text-xs text-red-400 font-medium">{error}</span>}
    </div>
  );
};
