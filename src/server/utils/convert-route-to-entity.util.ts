const mapping: Record<string, string> = {
  'home-owners': 'home_owner',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
