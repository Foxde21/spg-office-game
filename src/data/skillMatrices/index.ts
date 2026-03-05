import type { SkillMatrix } from './softwareDev'
import { SOFTWARE_DEV_SKILL_MATRIX } from './softwareDev'
import { QA_SKILL_MATRIX } from './qa'
import { BA_SKILL_MATRIX } from './ba'
import { PRODUCT_SKILL_MATRIX } from './product'
import { DESIGN_SKILL_MATRIX } from './design'

export const SKILL_MATRICES: SkillMatrix[] = [
  SOFTWARE_DEV_SKILL_MATRIX,
  QA_SKILL_MATRIX,
  BA_SKILL_MATRIX,
  PRODUCT_SKILL_MATRIX,
  DESIGN_SKILL_MATRIX
]

export function getSkillMatrix(id: string): SkillMatrix | undefined {
  return SKILL_MATRICES.find((m) => m.id === id)
}

export function getSkillMatrixForNpc(npcId: string): SkillMatrix | undefined {
  if (npcId === 'petya-senior') {
    return SOFTWARE_DEV_SKILL_MATRIX
  }

  if (npcId === 'masha-qa') {
    return QA_SKILL_MATRIX
  }

  if (npcId === 'igor-analyst') {
    return BA_SKILL_MATRIX
  }

  if (npcId === 'olga-product') {
    return PRODUCT_SKILL_MATRIX
  }

  if (npcId === 'lesha-designer') {
    return DESIGN_SKILL_MATRIX
  }

  return undefined
}
