// The Markdown of VoxNexus' own scenes, from the same copy the scenes show. What a visitor can click through on the
// page is written out in full: every sentence with its result, every system with what it adds.
import type { VoxCopy } from './product';

const call = (c: VoxCopy['scenes']['talk']['calls'][number]) =>
  `- 「${c.say}」 → ${[...c.steps, c.result ?? c.stop].filter(Boolean).join(' → ')}\n  ${c.reply}`;

export const VOXNEXUS_MARKDOWN: Record<string, (copy: VoxCopy) => string> = {
  maze: (c) => `## ${c.shift.now}\n\n${c.shift.old}\n\n${c.shift.now}`,
  talk: (c) => {
    const s = c.scenes.talk;
    return `## ${s.title}\n\n${s.note}\n\n${s.calls.map(call).join('\n')}\n\n${c.ui.demoData}`;
  },
  latency: (c) => {
    const s = c.scenes.latency;
    return `## ${s.value} ${s.unit}\n\n${s.note}`;
  },
  connect: (c) => {
    const s = c.scenes.connect;
    return `## ${s.title.replace(/\n/g, '')}\n\n${s.lead}\n\n${s.systems.map((x) => `- **${x.name}**: ${x.can.join(' / ')}`).join('\n')}`;
  },
  forge: (c) => {
    const s = c.scenes.forge;
    const l = s.labels;
    return `## ${s.title}\n\n${s.lead}\n\n`
      + s.examples.map((e) => `- 「${e.say}」\n  - ${l.name}: ${e.name}\n  - ${l.langs}: ${e.langs}\n  - ${l.can}: ${e.can.join(' / ')}\n  - ${l.cannot}: ${e.cannot.join(' / ')}\n  - ${l.first}: ${e.first}`).join('\n')
      + `\n\n### ${s.probe.title}\n\n「${s.probe.say}」 → ${s.probe.cause} ${s.probe.count}\n\n${s.probe.help}`;
  },
  boundary: (c) => `## ${c.trust.title}\n\n「${c.scenes.boundary.say}」 → ${c.scenes.boundary.denied} → ${c.scenes.boundary.human}\n\n${c.trust.items.map((t) => `- ${t}`).join('\n')}`,
};
