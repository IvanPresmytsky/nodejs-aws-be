import { EEffectType } from '../../types';

export const getEffect = (username: string, password: string) => {
  const storedUserPassword = process.env[username];

  if (!storedUserPassword) {
    console.error('There is no stored user password!')
    return EEffectType.Deny;
  }
  return storedUserPassword !== password
    ? EEffectType.Deny
    : EEffectType.Allow;
};
