
import { Code, Shield, Palette, Network, Bot, Brain } from 'lucide-react';

export const iconOptions = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Network', label: 'Network', icon: Network },
  { value: 'Bot', label: 'Bot', icon: Bot },
  { value: 'Brain', label: 'Brain', icon: Brain },
].filter(option => option.value && option.value.trim() !== '');

export const colorOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Կապույտ' },
  { value: 'from-red-500 to-orange-500', label: 'Կարմիր' },
  { value: 'from-purple-500 to-pink-500', label: 'Մանուշակագույն' },
  { value: 'from-green-500 to-emerald-500', label: 'Կանաչ' },
  { value: 'from-indigo-500 to-blue-500', label: 'Ինդիգո' },
  { value: 'from-yellow-500 to-amber-500', label: 'Դեղին' },
].filter(option => option.value && option.value.trim() !== '');
