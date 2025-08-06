import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  autoFocus?: boolean;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Cari produk...',
  showFilters = false,
  onToggleFilters,
  filtersActive = false,
  className = '',
  size = 'medium',
  autoFocus = false,
  debounceMs = 300
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const sizeClasses = {
    small: {
      container: 'h-8',
      input: 'text-sm pl-8 pr-8',
      icon: 'h-4 w-4',
      iconPosition: 'left-2'
    },
    medium: {
      container: 'h-10',
      input: 'text-base pl-10 pr-10',
      icon: 'h-5 w-5',
      iconPosition: 'left-3'
    },
    large: {
      container: 'h-12',
      input: 'text-lg pl-12 pr-12',
      icon: 'h-6 w-6',
      iconPosition: 'left-4'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <div className={`absolute inset-y-0 ${classes.iconPosition} flex items-center pointer-events-none`}>
            <Search className={`${classes.icon} text-gray-400`} />
          </div>
          
          <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`
              ${classes.container} ${classes.input}
              w-full border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${isFocused ? 'shadow-md' : 'shadow-sm'}
            `}
          />
          
          {/* Clear Button */}
          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600`}
            >
              <X className={classes.icon} />
            </button>
          )}
        </div>
      </form>

      {/* Filter Toggle */}
      {showFilters && onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={`
            ${classes.container} px-3 border rounded-lg
            flex items-center justify-center
            transition-all duration-200
            ${
              filtersActive
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          <Filter className={classes.icon} />
          <span className="ml-2 hidden sm:inline text-sm font-medium">
            Filter
          </span>
          {filtersActive && (
            <span className="ml-1 bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded">
              ON
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default SearchBar;