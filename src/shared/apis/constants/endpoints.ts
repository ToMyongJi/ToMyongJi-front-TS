export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  receipt: {
    root: '/api/receipt',
    specific: (receiptId: number) => `/api/receipt/${receiptId}`,
    keyword: '/api/receipt/keyword',
    club: (id?: number) => `/api/receipt/club/${id}`,
    paging: (clubId?: number) => `/api/receipt/club/${clubId}/paging`,
  },

  auth: {
    login: '/api/users/login',
    signup: '/api/users/signup',
    findId: '/api/users/find-id',
    forgotPassword: '/api/users/forgot-password',
    verify: '/api/users/clubVerify',
    check: (userId: string) => `/api/users/${userId}`,
    delete: '/api/users/delete',
    emailCheck: '/api/users/verifyCode', //이메일 인증코드 확인
    email: '/api/users/emailCheck', //이메일 전송 (url이 emailCheck라서 헷갈릴까봐 적어둠.)
    resetPasswordSendEmail: '/api/password/reset-request', //비밀번호 재설정 이메일 전송
    resetPassword: '/api/password/reset-confirm', //비밀번호 재설정 확인
  },

  csv: {
    upload: (userIndexId: number) => `/api/csv/upload/${userIndexId}`,
    export: '/api/csv/export',
  },

  club: {
    root: '/api/club',
    transfer: '/api/club/transfer',
    college: (collegeId: number) => `/api/club/${collegeId}`,
  },

  college: {
    all: '/api/collegesAndClubs',
  },

  parse: {
    breakdown: '/api/breakdown/parse',
  },

  ocr: {
    upload: (userId: number) => `/api/ocr/upload/${userId}`,
  },

  my: {
    add: '/api/my/members',
    view: (id: number) => `/api/my/${id}`,
    viewMember: (id: number) => `/api/my/members/${id}`,
    deleteMember: (deletedStudentNumb: number) => `/api/my/members/${deletedStudentNumb}`,
  },

  status: {
    change: '/api/admin/status',
    check: '/api/status',
  },

  admin: {
    president: '/api/admin/president',
    member: '/api/admin/member',
    clubPresident: (clubId: number) => `/api/admin/president/${clubId}`,
    clubMember: (clubId: number) => `/api/admin/member/${clubId}`,
    delete: (memberId: number) => `/api/admin/member/${memberId}`,
  },
};
