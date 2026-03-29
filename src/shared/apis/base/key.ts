export const QK = {
  my: {
    getMyInfo: (id: number) => ['my', 'getMyInfo', id] as const,
    viewMember: (id: number) => ['my', 'viewMember', id] as const,
  },

  auth: {
    findIds: () => ['auth', 'findIds'] as const,
    clubVerify: () => ['auth', 'clubVerify'] as const,
    deleteUser: () => ['auth', 'deleteUser'] as const,
    checkUser: (userId: string) => ['auth', 'checkUser', userId] as const,
    email: () => ['auth', 'email'] as const,
    emailVerify: () => ['auth', 'emailVerify'] as const,
  },

  receipt: {
    list: (clubId?: number, size?: number, y?: number, m?: number, page?: number) =>
      ['receiptList', clubId, size, y, m, page] as const,
    club: (id?: number) => ['receipt', id] as const,
    search: (keyword: string) => ['receiptSearch', keyword] as const,
  },

  collegeAndClubs: {
    all: () => ['collegeAndClubs'] as const,
  },

  college: {
    getAllClub: () => ['college', 'getAllClub'] as const,
    getCollegeByClub: (collegeId: number) => ['college', 'getCollegeByClub', collegeId] as const,
  },
  admin: {
    president: (clubId: number) => ['admin', 'president', clubId] as const,
    member: (clubId: number) => ['admin', 'member', clubId] as const,
  },
};
