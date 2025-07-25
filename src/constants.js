
import { CandidateStatus } from './types.js';

export const STATUS_COLORS = {
  [CandidateStatus.APPLIED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [CandidateStatus.REVIEWING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [CandidateStatus.INTERVIEW]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [CandidateStatus.FINALIST]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  [CandidateStatus.HIRED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [CandidateStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};