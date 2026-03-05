export type SkillMatrixLevelId = 'junior' | 'middle' | 'senior' | 'expert'

export interface SkillMatrixItem {
  tag: string
  title: string
  expectations: Record<SkillMatrixLevelId, string>
}

export interface SkillMatrix {
  id: string
  name: string
  items: Record<string, SkillMatrixItem>
}

export const SOFTWARE_DEV_SKILL_MATRIX: SkillMatrix = {
  id: 'software-dev',
  name: 'Software Development',
  items: {
    'process.sdlc': {
      tag: 'process.sdlc',
      title: 'Software development process knowledge',
      expectations: {
        junior: 'Follow defined software development process under supervision.',
        middle: 'Follow process with minimal supervision; intermediate SDLC knowledge.',
        senior: 'Follow and improve processes; advanced SDLC knowledge; introduce tools and approaches.',
        expert: 'Setup and improve processes; evaluate, define and introduce tools and approaches.'
      }
    },
    documentation: {
      tag: 'documentation',
      title: 'Documentation skills',
      expectations: {
        junior: 'Understand and follow project requirements, solution design and technical documentation.',
        middle: 'Create technical documentation of own code.',
        senior: 'Create high-quality architecture diagrams; perform functional requirement reviews.',
        expert: 'Create system-level documentation, non-functional requirements and audit documentation.'
      }
    },
    autonomy: {
      tag: 'autonomy',
      title: 'Reliability & Autonomy',
      expectations: {
        junior: 'Work effectively under supervision.',
        middle: 'Implement functionality with minimal supervision; write unit/integration tests.',
        senior: 'Work without supervision; own subsystems; offer improvements; interview candidates.',
        expert: 'Technical supervisor; responsible for delivery; introduce architecture/process improvements.'
      }
    },
    quality: {
      tag: 'quality',
      title: 'Quality',
      expectations: {
        junior: 'Be responsible for own code quality.',
        middle: 'Create deliverables in good quality.',
        senior: 'Deliver high-quality results and be a role model.',
        expert: 'Be responsible for quality of others and deliver excellent-quality results.'
      }
    },
    'customer.relations': {
      tag: 'customer.relations',
      title: 'Customer relations',
      expectations: {
        junior: 'Not expected to communicate with customers.',
        middle: 'Participate in calls; may visit customers under supervision.',
        senior: 'Have good customer skills; visit customers independently.',
        expert: 'Build trusted relationships and drive discussions.'
      }
    }
  }
}
