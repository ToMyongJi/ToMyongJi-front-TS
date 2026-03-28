export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ENDPOINTS = {
    receipt: {
        root: '/api/receipt',
        specific: (receiptId) => `/api/receipt/${receiptId}`,
        keyword: '/api/receipt/keyword',
        club: (id) => `/api/receipt/club/${id}`,
        paging: (clubId) => `/api/receipt/club/${clubId}/paging`,
    },
    auth: {
        login: '/api/users/login',
        signup: '/api/users/signup',
        findId: '/api/users/find-id',
        verify: '/api/users/clubVerify',
        check: (userId) => `/api/users/${userId}`,
        delete: '/api/users/delete',
        emailCheck: '/api/users/verifyCode', //이메일 인증코드 확인
        email: '/api/users/emailCheck', //이메일 전송 (url이 emailCheck라서 헷갈릴까봐 적어둠.)
    },
    csv: {
        upload: (userIndexId) => `/api/csv/upload/${userIndexId}`,
        export: '/api/csv/export',
    },
    club: {
        root: '/api/club',
        transfer: '/api/club/transfer',
        college: (collegeId) => `/api/club/${collegeId}`,
    },
    college: {
        all: '/api/collegesAndClubs',
    },
    parse: {
        breakdown: '/api/breakdown/parse',
    },
    ocr: {
        upload: (userId) => `/api/ocr/upload/${userId}`,
    },
    my: {
        add: '/api/my/members',
        view: (id) => `/api/my/${id}`,
        viewMember: (id) => `/api/my/members/${id}`,
        deleteMember: (deletedStudentNumb) => `/api/my/members/${deletedStudentNumb}`,
    },
    status: {
        change: '/api/admin/status',
        check: '/api/status',
    },
    admin: {
        president: '/api/admin/president',
        member: '/api/admin/member',
        clubPresident: (clubId) => `/api/admin/president/${clubId}`,
        clubMember: (clubId) => `/api/admin/member/${clubId}`,
        deltet: (memberId) => `/api/admin/member/${memberId}`,
    },
};
