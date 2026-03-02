import type { CareerPath } from '../../types/assessment'
import { AI_CAREER_PATH } from './ai'

export const CAREER_PATHS: CareerPath[] = [
  AI_CAREER_PATH
]

export function getCareerPath(id: string): CareerPath | undefined {

  return CAREER_PATHS.find(p => p.id === id)
}

export function getAllCareerPaths(): CareerPath[] {

  return CAREER_PATHS
}
