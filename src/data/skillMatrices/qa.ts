import type { SkillMatrix } from './softwareDev'

export const QA_SKILL_MATRIX: SkillMatrix = {
  id: 'qa',
  name: 'Quality Assurance',
  items: {
    'qa.testing-basics': {
      tag: 'qa.testing-basics',
      title: 'Experience in software testing',
      expectations: {
        junior: 'Know testing basics: classifications, levels of testing, bug tracking.',
        middle: 'Have 2–3 years experience; functional/regression/smoke testing in practice.',
        senior: 'Have 5+ years experience and mentor other QA engineers.',
        expert: 'Have 8+ years experience; setup and evolve testing processes.'
      }
    },
    'qa.process': {
      tag: 'qa.process',
      title: 'QA process knowledge',
      expectations: {
        junior: 'Follow testing process.',
        middle: 'Follow process with minimal supervision.',
        senior: 'Improve process and propose tools.',
        expert: 'Introduce tools and processes; expert knowledge of QA process.'
      }
    },
    'qa.docs': {
      tag: 'qa.docs',
      title: 'Design and documentation skills',
      expectations: {
        junior: 'Understand requirements and create simple test cases.',
        middle: 'Create full test cases and reports; use test design techniques.',
        senior: 'Analyze requirements and create high-quality test plans.',
        expert: 'Audit processes and create advanced automation documentation.'
      }
    },
    'qa.autonomy': {
      tag: 'qa.autonomy',
      title: 'Reliability & Autonomy',
      expectations: {
        junior: 'Work under supervision.',
        middle: 'Handle tracking/reporting and be responsible for results.',
        senior: 'Work independently and interview candidates.',
        expert: 'Supervise QA team and be responsible for quality gates.'
      }
    },
    'qa.quality': {
      tag: 'qa.quality',
      title: 'Quality',
      expectations: {
        junior: 'Be responsible for assigned testing.',
        middle: 'Produce good quality deliverables.',
        senior: 'Produce high-quality deliverables.',
        expert: 'Ensure quality of the entire team.'
      }
    },
    'qa.customer': {
      tag: 'qa.customer',
      title: 'Customer relations',
      expectations: {
        junior: 'No direct customer communication.',
        middle: 'Participate in calls.',
        senior: 'Communicate with customer independently.',
        expert: 'Build trusted relationships.'
      }
    }
  }
}
