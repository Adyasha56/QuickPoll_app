export const getUserId = (): string => {
  let userId = localStorage.getItem('quickpoll_userId');
  
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('quickpoll_userId', userId);
  }
  
  return userId;
};