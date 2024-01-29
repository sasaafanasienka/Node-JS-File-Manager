import {USERNAME_FLAG} from '../../shared/variables.js';

export const validateStartParams = ({ flag, username }) => {
  if (!flag || flag !== USERNAME_FLAG) {
    return false
  }
  if (!username) {
    return false
  }
  return true
}