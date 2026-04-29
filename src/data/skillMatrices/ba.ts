import type { SkillMatrix } from './softwareDev'

export const BA_SKILL_MATRIX: SkillMatrix = {
  id: 'ba',
  name: 'Business Analysis',
  items: {
    'ba.professional-experience': {
      tag: 'ba.professional-experience',
      title: 'Professional experience',
      expectations: {
        junior: 'Understand and analyze business processes; 1+ year relevant experience.',
        middle: '3+ years experience including UML; follow SDLC with minimal supervision.',
        senior: '5+ years including UML/Modeling/Design; mentoring ability; expert in 1 domain.',
        expert: '7+ years experience; supervise and develop other BAs; expert in key domains.'
      }
    },
    'ba.process': {
      tag: 'ba.process',
      title: 'Software process knowledge',
      expectations: {
        junior: 'Work under supervision; production experience not required.',
        middle: 'Strong SDLC knowledge (Agile/Waterfall).',
        senior: 'Expert in BA and SDLC processes; manage risk, scope and estimation.',
        expert: 'Expert in industry standards; drive Agile practices.'
      }
    },
    'ba.documentation': {
      tag: 'ba.documentation',
      title: 'Design & documentation skills',
      expectations: {
        junior: 'Read documentation and create documentation under supervision.',
        middle: 'Create analysis/requirements independently and use visualization tools.',
        senior: 'Produce high-quality documentation and drive process optimization.',
        expert: 'Create excellent documentation and combine analytics with deep visualization.'
      }
    },
    'ba.domain-knowledge': {
      tag: 'ba.domain-knowledge',
      title: 'Business domain knowledge',
      expectations: {
        junior: 'Not required.',
        middle: 'Basic domain understanding; assist SMEs.',
        senior: 'Good domain knowledge; can deputize SMEs.',
        expert: 'Deep domain expertise; teach business concepts.'
      }
    },
    'ba.reliability': {
      tag: 'ba.reliability',
      title: 'Reliability',
      expectations: {
        junior: 'Work under supervision.',
        middle: 'Work without supervision and mentor juniors.',
        senior: 'Be self-managing and interview candidates.',
        expert: 'Take full responsibility for a subsystem and be a single point of contact.'
      }
    },
    'ba.customer-relations': {
      tag: 'ba.customer-relations',
      title: 'Customer relations',
      expectations: {
        junior: 'Participate in calls and collect data with supervision.',
        middle: 'Facilitate workshops and build relationships.',
        senior: 'Work with top-tier clients and organize visits.',
        expert: 'Build long-term relationships and handle strategic communication.'
      }
    }
  }
}
