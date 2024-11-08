export interface RegisterFormInterface{
  email: string,
  password: string,
  displayName: string,
  invitationCode: string,
  type?: string, // google
}