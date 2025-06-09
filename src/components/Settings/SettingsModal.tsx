import { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';

const TRAIT_LIMIT = 50;
const TRAIT_MAX_LENGTH = 100;
const NAME_LIMIT = 50;
const OCCUPATION_LIMIT = 100;
const EXTRA_LIMIT = 3000;

const defaultTraits = [
    'friendly',
    'witty',
    'concise',
    'curious',
    'empathetic',
    'creative',
    'patient',
];

export default function SettingsModal({ open, onClose, onSave, initial, loading }: {
    open: boolean;
    onClose: () => void;
    onSave: (settings: any) => void;
    initial?: any;
    loading?: boolean;
}) {
    const [name, setName] = useState(initial?.name || '');
    const [occupation, setOccupation] = useState(initial?.occupation || '');
    const [traits, setTraits] = useState<string[]>(initial?.traits || defaultTraits);
    const [traitInput, setTraitInput] = useState('');
    const [extra, setExtra] = useState(initial?.extra || '');

    // Update state when initial values change
    useEffect(() => {
        if (initial) {
            setName(initial.name || '');
            setOccupation(initial.occupation || '');
            setTraits(initial.traits || defaultTraits);
            setExtra(initial.extra || '');
        }
    }, [initial]);

    const addTrait = (trait: string) => {
        if (
            trait &&
            !traits.includes(trait) &&
            traits.length < TRAIT_LIMIT &&
            trait.length <= TRAIT_MAX_LENGTH
        ) {
            setTraits([...traits, trait]);
        }
    };

    const removeTrait = (trait: string) => {
        setTraits(traits.filter(t => t !== trait));
    };

    if (!open) return null;

    return loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <Spinner />
        </div>
    ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-neutral-900 text-white rounded-xl shadow-xl w-full max-w-lg p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">×</button>
                <h2 className="text-2xl font-bold mb-6">Customize T3 Clone</h2>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">What should T3 Clone call you?</label>
                    <input
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        maxLength={NAME_LIMIT}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <div className="text-xs text-gray-400 text-right">{name.length}/{NAME_LIMIT}</div>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">What do you do?</label>
                    <input
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        maxLength={OCCUPATION_LIMIT}
                        value={occupation}
                        onChange={e => setOccupation(e.target.value)}
                        placeholder="Engineer, student, etc."
                    />
                    <div className="text-xs text-gray-400 text-right">{occupation.length}/{OCCUPATION_LIMIT}</div>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">T3 traits</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {traits.map(trait => (
                            <span
                                key={trait}
                                className="bg-purple-900 text-purple-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                                {trait}
                                <button
                                    onClick={() => removeTrait(trait)}
                                    className="hover:text-purple-300"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            maxLength={TRAIT_MAX_LENGTH}
                            value={traitInput}
                            onChange={e => setTraitInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTrait(traitInput);
                                    setTraitInput('');
                                }
                            }}
                            placeholder="Add a trait"
                        />
                        <button
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
                            onClick={() => {
                                addTrait(traitInput);
                                setTraitInput('');
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <div className="text-xs text-gray-400 text-right">{traits.length}/{TRAIT_LIMIT}</div>
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-semibold">Anything else T3 Clone should know about you?</label>
                    <textarea
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                        maxLength={EXTRA_LIMIT}
                        value={extra}
                        onChange={e => setExtra(e.target.value)}
                        placeholder="Interests, values, or preferences to keep in mind"
                    />
                    <div className="text-xs text-gray-400 text-right">{extra.length}/{EXTRA_LIMIT}</div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" className="bg-neutral-700 hover:bg-neutral-800" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={() => onSave({ name, occupation, traits, extra })}>Save</Button>
                </div>
            </div>
        </div>
    );
} 