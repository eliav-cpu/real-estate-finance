import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { HEBREW_MONTHS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split('-').map(Number)
  return { year: y, month: m }
}

export function hebrewMonth(month: number): string {
  return HEBREW_MONTHS[month - 1] || ''
}

export function hebrewMonthKey(key: string): string {
  const { year, month } = parseMonthKey(key)
  return `${hebrewMonth(month)} ${year}`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('he-IL')
}

export function currentMonthKey(): string {
  const now = new Date()
  return monthKey(now.getFullYear(), now.getMonth() + 1)
}

export function allMonthKeys(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => monthKey(year, i + 1))
}
