import type { SkillMatrix } from './softwareDev'

export const DESIGN_SKILL_MATRIX: SkillMatrix = {
  id: 'design',
  name: 'Design (UI/UX)',
  items: {
    'design.research': {
      tag: 'design.research',
      title: 'User research & problem framing',
      expectations: {
        junior: 'Collect insights with guidance; work from clear briefs; ask clarifying questions.',
        middle: 'Plan lightweight research; synthesize insights; frame problems and hypotheses.',
        senior: 'Drive discovery with PM/BA; validate assumptions; write strong problem statements.',
        expert: 'Set research standards; mentor teams; scale discovery and insight-sharing.'
      }
    },
    'design.ux': {
      tag: 'design.ux',
      title: 'UX design & interaction',
      expectations: {
        junior: 'Create basic flows and wireframes under supervision.',
        middle: 'Design complete user journeys; cover edge cases; apply accessibility basics.',
        senior: 'Design complex interactions; balance UX with constraints; raise the quality bar.',
        expert: 'Define UX principles; drive consistency; solve ambiguous UX problems.'
      }
    },
    'design.ui': {
      tag: 'design.ui',
      title: 'UI design & visual craft',
      expectations: {
        junior: 'Follow style guides and produce clean UI screens.',
        middle: 'Create polished UI; improve hierarchy and consistency.',
        senior: 'Set visual direction for areas; review others; raise craft across the product.',
        expert: 'Define visual system direction; drive brand and product coherence.'
      }
    },
    'design.system': {
      tag: 'design.system',
      title: 'Design systems',
      expectations: {
        junior: 'Use existing components and tokens correctly.',
        middle: 'Contribute components and patterns with guidance.',
        senior: 'Evolve the design system; define patterns and governance with engineering.',
        expert: 'Own system strategy; drive adoption; reduce UI debt measurably.'
      }
    },
    'design.collaboration': {
      tag: 'design.collaboration',
      title: 'Collaboration & communication',
      expectations: {
        junior: 'Explain design decisions and take feedback constructively.',
        middle: 'Facilitate design reviews; align with PM/engineering; manage handoff.',
        senior: 'Lead cross-functional alignment; handle conflicts and trade-offs.',
        expert: 'Influence stakeholders; improve org processes; mentor and scale practices.'
      }
    },
    'design.delivery': {
      tag: 'design.delivery',
      title: 'Delivery & ownership',
      expectations: {
        junior: 'Prepare assets and specs; follow through on feedback during implementation.',
        middle: 'Own a feature end-to-end and ensure implementation quality.',
        senior: 'Own outcomes for a stream; improve processes and quality gates.',
        expert: 'Be responsible for design excellence across portfolio and delivery standards.'
      }
    }
  }
}
