export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  receipt: {
    root : '/api/receipt',
    specific: (receiptId: string) => `/api/receipt/${receiptId}`,
    keyword: '/api/receipt/keyword',
    club: (clubId: string) => `/api/receipt/club/${clubId}`,
    paging: (clubId: string) => `/api/receipt/club/${clubId}/paging`,
  },

  auth:{
    login: '/api/users/login',
    signup: '/api/users/signup',
    findId: '/api/users/find-id',
    verify: '/api/users/clubVerify',
    check: (userId: string) => `/api/users/${userId}`,
    delete: '/api/users/delete',
    email: '/api/users/verfiyCode',
    emailCheck: '/api/users/emailCheck'
  },

  csv:{
    upload: (userIndexId: number)=> `/api/csv/upload/${userIndexId}`,
    export: '/api/csv/export'
  },

  club:{
    root: '/api/club',
    transfer:'/api/club/transfer',
    college: (collegeId: number) => `/api/club/${collegeId}`,
  },

  college: {
    all : '/api/collegesAndClubs'
  },

  parse: {
    breakdown: '/api/breakdown/parse'
  },

  ocr:{
    upload: (userId: number) => `/api/ocr/upload/${userId}`,
  },

  my:{
    add: '/api/my/members',
    view: (id: number) => `/api/my/${id}`,
    viewMember: (id: number) => `/api/my/members/${id}`,
    deleteMember: (deletedStudentNumb: number) => `/api/my/members/${deletedStudentNumb}`,
  },

  status:{
    change: '/api/admin/status',
    check: '/api/status'
  },

  admin:{
    president: '/api/admin/president',
    member: '/api/admin/member',
    clubPresident: (clubId: number) => `/api/admin/president/${clubId}`,
    clubMember: (clubId: number) => `/api/admin/member/${clubId}`,
    deltet: (memberId: number) => `/api/admin/member/${memberId}`,
  }
}