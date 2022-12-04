import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const emailRe = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const Classroom: any = firestore().collection('classrooms');
const Users = firestore().collection('users');

export default {
    create: async ({
        name,
        email,
        rollno,
        classroomId,
    }: {
        name: string;
        email?: string;
        rollno: string;
        classroomId?: string;
    }) => {
        return new Promise(async (resolve, reject) => {
            if (!name) {
                reject({
                    type: 'warning',
                    message: 'Student name is required',
                });
                return;
            }
            if (!rollno) {
                reject({
                    type: 'warning',
                    message: ' A unique identifier like rollno is required',
                });
                return;
            }
            if (email && !emailRe.test(email)) {
                reject({
                    type: 'warning',
                    message: ' invalid email',
                });
                return;
            }

            let data: any = {
                name,
                rollno,
            };

            if (email) {
                const user = await Users.where('email', '==', email).get();
                // console.log(user.docs[0]);
                if (user.docs.length > 0) {
                    const userId = user.docs[0].ref.id;
                    // console.log('userId', userId);
                    data.userId = userId;
                }

                data.email = email;
            }

            data.classroomId = classroomId;
            data.teacherId = auth()?.currentUser?.uid;

            const Students = Classroom.doc(classroomId).collection('students');

            Students.add(data)
                .then(async () => {
                    const classroom = (
                        await Classroom.doc(classroomId).get()
                    ).data();

                    Classroom.doc(classroomId)
                        .update({
                            studentCount: classroom?.studentCount + 1,
                        })
                        .then(() => {
                            resolve('student added successfully');
                        });
                })
                .catch((err: any) => {
                    reject({
                        type: 'error',
                        message: err.code,
                    });
                });
        });
    },
    list: async (classroomId: string) => {
        return new Promise(async (resolve, reject) => {
            const Students = Classroom.doc(classroomId)
                .collection('students')
                .orderBy('rollno', 'asc');
            const res = await Students.get();
            resolve(res);
        });
    },
    realTimeList: ({
        classroomId,
        onResult,
    }: {
        classroomId: string;
        onResult: (snapshot: any) => void;
    }) => {
        const Students = Classroom.doc(classroomId)
            .collection('students')
            .orderBy('rollno', 'asc');
        return Students.onSnapshot(onResult);
    },
    delete: ({
        studentId,
        classroomId,
    }: {
        studentId: string;
        classroomId: string;
    }) => {
        return new Promise(async (resolve, reject) => {
            const doc = Classroom.doc(classroomId)
                .collection('students')
                .doc(studentId);
            const exists = (await doc.get()).exists;
            if (!exists) {
                reject({
                    type: 'warning',
                    message: 'Unable to delete Student',
                });
                return;
            }

            doc.delete()
                .then(async () => {
                    let classroomDoc = Classroom.doc(classroomId);
                    await classroomDoc.update({
                        studentCount:
                            (await classroomDoc.get())._data.studentCount - 1,
                    });
                    resolve('Student deleted successfully');
                })
                .catch((err: any) => {
                    console.log(err);
                    reject({
                        type: 'error',
                        message: 'Unable to delete Student',
                    });
                });
        });
    },
    update: ({
        studentId,
        classroomId,
        studentData,
    }: {
        studentId: string;
        classroomId: string;
        studentData: {
            name: string;
            rollno: string;
            email?: string;
        };
    }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = Classroom.doc(classroomId)
                    .collection('students')
                    .doc(studentId);
                const exists = (await doc.get()).exists;

                let reqBody: any = {
                    name: studentData.name,
                    rollno: studentData.rollno,
                };

                if (studentData.email) reqBody.email = studentData.email;
                if (!exists) {
                    reject({
                        type: 'error',
                        message: 'Unable to update Student',
                    });
                    return;
                }

                await doc.update(reqBody);

                resolve(true);
            } catch (error) {
                reject({
                    type: 'error',
                    message: 'Unable to update Student',
                });
            }
        });
    },

    import: ({
        classroomId,
        targetClassroomId,
        currStudentCount,
    }: {
        classroomId: string;
        targetClassroomId: string;
        currStudentCount: number;
    }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const StudentsRef =
                    Classroom.doc(targetClassroomId).collection('students');
                const res = (await StudentsRef.get())._docs;

                const Students =
                    Classroom.doc(classroomId).collection('students');
                res.forEach(async (elem: any) => {
                    await Students.add({...elem._data});
                });

                await Classroom.doc(classroomId).update({
                    studentCount: currStudentCount + res.length,
                });

                resolve(true);
            } catch (error: any) {
                reject({
                    type: 'error',
                    message: error.code,
                });
            }
        });
    },
};
