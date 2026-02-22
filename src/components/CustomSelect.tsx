'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Seleccionar...',
    className = '',
    required = false,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={ref} className={`relative ${className} ${isOpen ? 'z-50' : ''}`}>
            {/* Select Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-left flex items-center justify-between focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 transition-all hover:border-gray-300"
            >
                <span className={`text-sm font-medium truncate mr-2 ${selectedOption ? 'text-[var(--text-main)]' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-2 rounded-xl border border-gray-100 bg-white overflow-hidden shadow-2xl"
                    style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={`w-full px-4 py-3 text-left transition-all duration-150 text-sm font-medium border-b border-gray-50 last:border-0 ${option.value === value
                                ? 'bg-[var(--primary-blue)]/5 text-[var(--primary-blue)]'
                                : 'text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-main)]'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Hidden input for form validation */}
            {required && (
                <input
                    type="text"
                    value={value}
                    onChange={() => { }}
                    required
                    className="absolute opacity-0 pointer-events-none"
                    tabIndex={-1}
                />
            )}
        </div>
    );
}
