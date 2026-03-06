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

const NPC_TO_SKILL_MATRIX: Partial<Record<string, SkillMatrix>> = {
  'petya-senior': SOFTWARE_DEV_SKILL_MATRIX,
  'masha-qa': QA_SKILL_MATRIX,
  'igor-analyst': BA_SKILL_MATRIX,
  'olga-product': PRODUCT_SKILL_MATRIX,
  'lesha-designer': DESIGN_SKILL_MATRIX
}

export function getSkillMatrix(id: string): SkillMatrix | undefined {
  return SKILL_MATRICES.find((m) => m.id === id)
}

export function getSkillMatrixForNpc(npcId: string): SkillMatrix | undefined {
  return NPC_TO_SKILL_MATRIX[npcId]
}
