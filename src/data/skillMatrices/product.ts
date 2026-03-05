import type { SkillMatrix } from './softwareDev'

export const PRODUCT_SKILL_MATRIX: SkillMatrix = {
  id: 'product',
  name: 'Product Management',
  items: {
    'product.strategy': {
      tag: 'product.strategy',
      title: 'Product thinking & strategy',
      expectations: {
        junior: 'Understand product goals and basic prioritization; support discovery activities.',
        middle: 'Define outcomes, track metrics, and maintain a roadmap for an area.',
        senior: 'Own strategy for a product/stream; align stakeholders and drive trade-offs.',
        expert: 'Set product vision and portfolio strategy; build product operating model.'
      }
    },
    'product.discovery': {
      tag: 'product.discovery',
      title: 'Customer discovery & research',
      expectations: {
        junior: 'Participate in interviews and document insights under supervision.',
        middle: 'Plan and run discovery; synthesize insights into problem statements.',
        senior: 'Drive continuous discovery; validate assumptions with experiments.',
        expert: 'Define discovery standards, mentor teams, and scale discovery across org.'
      }
    },
    'product.requirements': {
      tag: 'product.requirements',
      title: 'Requirements & communication',
      expectations: {
        junior: 'Write clear user stories and acceptance criteria with guidance.',
        middle: 'Independently write requirements and facilitate refinement sessions.',
        senior: 'Drive alignment across teams; manage scope and ambiguity.',
        expert: 'Create system-level narratives and improve communication processes.'
      }
    },
    'product.prioritization': {
      tag: 'product.prioritization',
      title: 'Prioritization & roadmap',
      expectations: {
        junior: 'Use simple prioritization techniques and support backlog grooming.',
        middle: 'Prioritize based on value, risk and effort; manage dependencies.',
        senior: 'Balance short-term delivery with long-term investments; handle conflicts.',
        expert: 'Set portfolio priorities and drive governance and decision-making.'
      }
    },
    'product.delivery': {
      tag: 'product.delivery',
      title: 'Delivery & execution',
      expectations: {
        junior: 'Support sprint execution and release coordination.',
        middle: 'Ensure delivery predictability and work closely with design/engineering.',
        senior: 'Lead cross-functional execution; mitigate risks; improve delivery processes.',
        expert: 'Define delivery standards and drive org-wide execution excellence.'
      }
    },
    'product.metrics': {
      tag: 'product.metrics',
      title: 'Metrics & analytics',
      expectations: {
        junior: 'Track basic metrics and understand funnels and KPIs at a high level.',
        middle: 'Define success metrics and use analytics to drive decisions.',
        senior: 'Build metric systems; connect metrics to strategy and experiments.',
        expert: 'Define measurement culture and drive a data-informed product org.'
      }
    }
  }
}
