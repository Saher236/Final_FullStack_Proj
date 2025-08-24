// client/src/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// קרא לזה פעם אחת בתחילת האפליקציה (וגם אחרי לוגין/לוגאאוט)
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}
