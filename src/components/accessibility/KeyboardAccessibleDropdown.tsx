'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { createAriaAttributes, generateId } from '@/lib/accessibility';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface KeyboardAccessibleDropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  onSelect: (option: DropdownOption) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Fully keyboard-accessible dropdown component
 * Implements ARIA 1.1 combobox pattern with listbox
 */
export function KeyboardAccessibleDropdown({
  options,
  value,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  label,
  description,
  className = '',
  onSelect,
  onOpen,
  onClose
}: KeyboardAccessibleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  const dropdownId = generateId('dropdown');
  const listboxId = generateId('listbox');
  const labelId = generateId('label');
  const descriptionId = generateId('description');
  const errorId = generateId('error');

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { menuRef, selectedIndex } = useMenuKeyboardNavigation(isOpen);

  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options]);

  // Handle dropdown open/close
  const handleToggle = () => {
    if (disabled) return;

    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery('');
    onOpen?.();
    
    // Focus the input for search
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    onClose?.();
    
    // Return focus to trigger
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 100);
  };

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    
    onSelect(option);
    handleClose();
  };

  // Handle keyboard navigation in trigger
  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleToggle();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          handleOpen();
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          handleClose();
        }
        break;
    }
  };

  // Handle keyboard navigation in search input
  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        handleClose();
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Focus first option
        const firstOption = menuRef.current?.querySelector('[role="option"]') as HTMLElement;
        firstOption?.focus();
        break;
      case 'Enter':
        event.preventDefault();
        // Select first filtered option if available
        if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        }
        break;
    }
  };

  // Handle option click
  const handleOptionClick = (option: DropdownOption) => {
    handleSelect(option);
  };

  // Handle option keyboard navigation
  const handleOptionKeyDown = (event: React.KeyboardEvent, option: DropdownOption) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleSelect(option);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Listen for menu close events
  useEffect(() => {
    const handleMenuClose = () => {
      handleClose();
    };

    if (menuRef.current) {
      menuRef.current.addEventListener('menuClose', handleMenuClose);
      return () => {
        menuRef.current?.removeEventListener('menuClose', handleMenuClose);
      };
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={dropdownId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={dropdownId}
        type="button"
        disabled={disabled}
        onKeyDown={handleTriggerKeyDown}
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-left
          border border-border rounded-md bg-background
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-destructive' : 'border-border'}
          ${isOpen ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
        {...createAriaAttributes.expandableButton(isOpen, listboxId)}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={[
          description ? descriptionId : '',
          error ? errorId : ''
        ].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        aria-invalid={!!error}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence></AnimatePresence>   {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search options..."
                className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Search options"
              />
            </div>

            {/* Options List */}
            <ul
              id={listboxId}
              role="listbox"
              aria-labelledby={labelId}
              aria-activedescendant={
                selectedIndex >= 0 && filteredOptions[selectedIndex]
                  ? `option-${filteredOptions[selectedIndex].id}`
                  : undefined
              }
              className="max-h-60 overflow-auto py-1"
            >
              {filteredOptions.length === 0 ? (
                <li
                  role="option"
                  aria-selected={false}
                  className="px-3 py-2 text-sm text-muted-foreground"
                >
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.id}
                    id={`option-${option.id}`}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    tabIndex={-1}
                    onClick={() => handleOptionClick(option)}
                    onKeyDown={(e) => handleOptionKeyDown(e, option)}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center justify-between
                      focus:outline-none focus:bg-accent focus:text-accent-foreground
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'}
                      ${option.value === value ? 'bg-accent text-accent-foreground' : ''}
                      ${selectedIndex === index ? 'bg-accent text-accent-foreground' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {option.icon && (
                        <span className="flex-shrink-0" aria-hidden="true">
                          {option.icon}
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {option.value === value && (
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}