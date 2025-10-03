export function getGroupHost(group_id: string, groups) {
  const group = groups.find((g) => g.group_id === group_id);
  if (!group) return undefined;
  return group.group_data.members.find((member) => member.isHost);
}
