import { Href } from 'expo-router';

import { euro, getCareNeed } from '@/data/care';
import { getProfile } from '@/data/profiles';
import { useApp } from '@/store';

export type InboxItem = { key: string; at: number; title: string; text: string; href: Href; icon: string };

// Notifications built from what the person has done in the app (no push server yet).
export function useInbox() {
  const { applications, appliedAt, reports, donations, inboxReadAt } = useApp();

  const items: InboxItem[] = [
    ...applications
      .filter((id) => appliedAt[id])
      .map((id) => {
        const pet = getProfile(id);
        return {
          key: `app-${id}`,
          at: appliedAt[id],
          title: `${pet.shelter} got your request`,
          text: `They’ll contact you about meeting ${pet.name} within 2 working days.`,
          href: `/applications/${id}` as Href,
          icon: 'calendar-outline',
        };
      }),
    ...reports.flatMap((r) => [
      {
        key: `case-${r.id}`,
        at: r.createdAt,
        title: `Case ${r.id} is open`,
        text: 'A coordinator is looking for help nearby. Add an update if anything changes.',
        href: `/reports/${r.id}` as Href,
        icon: 'paw-outline',
      },
    ]),
    ...donations.map((d) => {
      const need = getCareNeed(d.id);
      return {
        key: `don-${d.at}`,
        at: d.at,
        title: `Thank you for ${euro(d.amount)}`,
        text: `${need.name}’s care team received your gift.`,
        href: { pathname: '/activity', params: { tab: 'donations' } } as Href,
        icon: 'heart-outline',
      };
    }),
  ].sort((a, b) => b.at - a.at);

  return { items, unread: items.filter((i) => i.at > inboxReadAt).length, readAt: inboxReadAt };
}
