import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
const Classroom = firestore().collection('classrooms');
const Schedule = firestore().collection('schedules');

function generateCode(length: number) {
    var result = '';
    var characters =
        'ABCxyz01DEFabcdefghGHRSTI5678JKLMNOPQUVpqrsWXYZijklmnotuvw2349';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
}
export default {
    create: async ({
        name,
        description,
        accent,
    }: {
        name: string;
        description: string;
        accent: string;
    }) => {
        return new Promise(async (resolve, reject) => {
            if (!name) {
                reject({
                    type: 'warning',
                    message: 'Class name is required',
                });
                return;
            }
            if (!accent) {
                reject({
                    type: 'warning',
                    message: 'Accent color is required',
                });
                return;
            }
            const classroom = await Classroom.where('name', '==', name).get();

            if (!!classroom.docs.length) {
                reject({
                    type: 'error',
                    message: 'Class with this name already exists',
                });
                return;
            }

            let uniqueId = uuid.v4().toString();

            Classroom.doc(uniqueId)
                .set({
                    id: uniqueId,
                    name: name,
                    accentColor: accent,
                    description: description,
                    // teacherId: Users.doc(auth()?.currentUser?.uid),
                    teacherId: auth()?.currentUser?.uid,
                    studentCount: 0,
                    code: generateCode(6),
                })
                .then(() => {
                    resolve('class created successfully');
                })
                .catch(err => {
                    reject({
                        type: 'error',
                        message: err.code,
                    });
                });
        });
    },
    get: (id: string) => {
        return new Promise(async (resolve, reject) => {
            let doc = await Classroom.doc(id).get();
            // console.log('doc', doc);
            resolve(doc.data());
        });
    },
    update: async ({
        id,
        name,
        description,
    }: {
        id: string;
        name: any;
        description: string;
    }) => {
        return new Promise(async (resolve, reject) => {
            if (!name) {
                reject({
                    type: 'warning',
                    message: 'Classroom name is required',
                });
                return;
            }
            if (!description) {
                reject({
                    type: 'warning',
                    message: 'Classroom description is required',
                });
                return;
            }

            //finally adding schedule
            Classroom.doc(id)
                .update({
                    name: name,
                    description: description,
                })
                .then(() => {
                    resolve('Schedule added successfully');
                })
                .catch(err => {
                    console.log(err);
                    reject({
                        type: 'error',
                        message: err.code,
                    });
                });
            // resolve(true);
        });
    },
    delete: (id: string) => {
        return new Promise(async (resolve, reject) => {
            const doc = Classroom.doc(id);

            const exists = (await doc.get()).exists;

            if (!exists) {
                reject({
                    type: 'warning',
                    message: 'Unable to delete Classroom',
                });
                return;
            }

            // TODO delete all the associated schedules

            const schedules = await Schedule.where('classId', '==', id).get();

            schedules.forEach(async (schedule: any) => {
                await Schedule.doc(
                    schedule._ref._documentPath._parts[1],
                ).delete();
            });

            doc.delete().then(() => {
                resolve('Classroom deleted successfully');
            });
        });
    },
    realTimeList: (onResult: (snapshot: any) => void) => {
        return Classroom.where(
            'teacherId',
            '==',
            // Users.doc(auth()?.currentUser?.uid),
            auth()?.currentUser?.uid,
        ).onSnapshot(onResult);
    },
    list: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const classes = await Classroom.where(
                    'teacherId',
                    '==',
                    // Users.doc(auth()?.currentUser?.uid),
                    auth()?.currentUser?.uid,
                ).get();

                // console.log(classes.docs);
                resolve(classes.docs);
            } catch (error) {
                reject(error);
            }
        });
    },

    getStudentStats: ({classroomId}: {classroomId: string}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const scheduleList = (
                    await Schedule.where('classId', '==', classroomId).get()
                ).docs;

                let stats: any = {
                    students: {},
                    totalSchedules: scheduleList.length,
                };
                scheduleList.forEach((schedule: any) => {
                    for (let rollno in schedule._data.presentStudents) {
                        if (!stats.students[rollno]) {
                            stats.students[rollno] = 0;
                        }

                        if (schedule._data.presentStudents[rollno]) {
                            stats.students[rollno]++;
                        }
                    }
                });
                resolve(stats);
            } catch (error) {
                console.log(error);
                reject({
                    type: 'error',
                    message: 'error occurred',
                });
            }
        });
    },
};
