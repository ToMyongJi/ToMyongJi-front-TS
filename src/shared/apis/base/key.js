export const QK = {
    my: {
        getMyInfo: (id) => ['my', 'getMyInfo', id],
        viewMember: (id) => ['my', 'viewMember', id],
    },
    auth: {
        findIds: () => ['auth', 'findIds'],
        clubVerify: () => ['auth', 'clubVerify'],
        deleteUser: () => ['auth', 'deleteUser'],
        checkUser: (userId) => ['auth', 'checkUser', userId],
        email: () => ['auth', 'email'],
        emailVerify: () => ['auth', 'emailVerify'],
    },
    receipt: {
        list: (clubId, size, y, m, page) => ['receiptList', clubId, size, y, m, page],
        club: (id) => ['receipt', id],
    },
    collegeAndClubs: {
        all: () => ['collegeAndClubs'],
    },
    college: {
        getAllClub: () => ['college', 'getAllClub'],
        getCollegeByClub: (collegeId) => ['college', 'getCollegeByClub', collegeId],
    },
};
