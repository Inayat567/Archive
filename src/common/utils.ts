export function userName(user: any) {
  return user.name || user.displayName || user.email || 'Person';
}

export function isTeamContact(contact: any){
  return !!contact.name && !contact.email;
}