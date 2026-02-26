export const QK = {
  auth: {
    findIds: () => ['auth', 'findIds'] as const,
    clubVerify: () => ['auth', 'clubVerify'] as const,
    deleteUser: () => ['auth', 'deleteUser'] as const,
    checkUser: () => ['auth', 'checkUser'] as const,
    email: () => ['auth', 'email'] as const,
    emailVerify: () => ['auth', 'emailVerify'] as const,
  },

  collegeAndClubs: {
    all: () => ['collegeAndClubs'] as const
  }

}