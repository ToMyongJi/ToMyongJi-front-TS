export const QK = {
  auth: {
    findIds: () => ['auth', 'findIds'] as const,
    clubVerify: () => ['auth', 'clubVerify'] as const,
    deleteUser: () => ['auth', 'deleteUser'] as const,
    checkUser: () => ['auth', 'checkUser'] as const,
    email: () => ['auth', 'email'] as const,
    emailVerify: () => ['auth', 'emailVerify'] as const,
  },

  receipt: {
    list: (clubId?: number, size?: number, y?: number, m?: number, page?: number) =>
      ['receiptList', clubId, size, y, m, page] as const,
  },

  collegeAndClubs: {
    all: () => ['collegeAndClubs'] as const
  }

}