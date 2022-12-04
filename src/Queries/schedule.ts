import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
function formatedTime(date: Date) {
    let dateString = date.toLocaleTimeString('en-US');

    let splittedString = dateString.split(' ');
    let startPart = (() => {
        let arr = splittedString[0].split(':');

        return arr[0] + ':' + arr[1];
    })();
    let endPart = splittedString[1];

    return startPart + ' ' + endPart;
}

const Schedule = firestore().collection('schedules');
const Classroom = firestore().collection('classrooms');
type datasetTypes = {
    studentsPresent: number;
    time: string;
};
export default {
    create: async ({
        classroom,
        date,
        start,
        end,
    }: {
        classroom: any;
        date: string;
        start: Date | undefined;
        end: Date | undefined;
    }) => {
        return new Promise(async (resolve, reject) => {
            if (!classroom) {
                reject({
                    type: 'warning',
                    message: 'Class is required',
                });
                return;
            }
            if (!start) {
                reject({
                    type: 'warning',
                    message: 'start time is required',
                });
                return;
            }
            if (!end) {
                reject({
                    type: 'warning',
                    message: 'end time is required',
                });
                return;
            }
            if (!date) {
                reject({
                    type: 'warning',
                    message: 'date is required',
                });
                return;
            }

            // //finding if a schedule exists in the provided timeframe and
            let schedules = await Schedule.where('date', '==', date).get();

            //checking for each schedule
            for (let item of schedules.docs) {
                // console.log(item.data());
                let data = item.data();
                if (
                    (start.valueOf() <= data.end &&
                        start.valueOf() >= data.start) ||
                    (end.valueOf() <= data.end && start.valueOf() >= data.start)
                ) {
                    reject({
                        type: 'warning',
                        message:
                            'A class is already sheduled in this time slot',
                    });
                    return;
                }
            }
            //finally adding schedule
            Schedule.add({
                classId: classroom.id,
                className: classroom.name,
                accentColor: classroom.accentColor,
                date: date,
                start: start.valueOf(),
                end: end.valueOf(),
                teacherId: auth()?.currentUser?.uid,
                presentStudents: {},
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
    update: async ({
        id,
        classroom,
        date,
        start,
        end,
    }: {
        id: string;
        classroom: any;
        date: string;
        start: Date | undefined;
        end: Date | undefined;
    }) => {
        return new Promise(async (resolve, reject) => {
            if (!classroom) {
                reject({
                    type: 'warning',
                    message: 'Class is required',
                });
                return;
            }
            if (!start) {
                reject({
                    type: 'warning',
                    message: 'start time is required',
                });
                return;
            }
            if (!end) {
                reject({
                    type: 'warning',
                    message: 'end time is required',
                });
                return;
            }
            if (!date) {
                reject({
                    type: 'warning',
                    message: 'date is required',
                });
                return;
            }
            const Schedule = Classroom.doc(classroom.id).collection(
                'schedules',
            );

            //finding if a schedule exists in the provided timeframe and
            let schedules = await Schedule.where('date', '==', date).get();

            //checking for each schedule
            for (let item of schedules.docs) {
                // console.log(item.data());
                let data = item.data();
                if (
                    (start.valueOf() <= data.end &&
                        start.valueOf() >= data.start) ||
                    (end.valueOf() <= data.end && start.valueOf() >= data.start)
                ) {
                    reject({
                        type: 'warning',
                        message:
                            'A class is already sheduled in this time slot',
                    });
                    return;
                }
            }
            //finally adding schedule
            Schedule.doc(id)
                .update({
                    classId: classroom.id,
                    className: classroom.name,
                    accentColor: classroom.accentColor,
                    date: date,
                    start: `${start.valueOf()}`,
                    end: `${end.valueOf()}`,
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
            const doc = Schedule.doc(id);

            const exists = (await doc.get()).exists;

            if (!exists) {
                reject({
                    type: 'warning',
                    message: 'Unable to delete Schedule',
                });
                return;
            }

            doc.delete().then(() => {
                resolve('Schedule deleted successfully');
            });
        });
    },
    get: (id: string) => {
        return new Promise(async (resolve, reject) => {
            // const Schedule = Classroom.doc(classroom.id).collection(
            //     'schedules',
            // );
            let doc = await Schedule.doc(id).get();
            // console.log('doc', doc);
            resolve(doc.data());
        });
    },
    getRealTime: ({
        id,
        onResult,
    }: {
        id: string;
        onResult: (snapshot: any) => void;
    }) => {
        return Schedule.doc(id).onSnapshot(onResult);
    },
    getByDate: async ({date}: {date: Date}) => {
        return new Promise(async (resolve, reject) => {
            let scheduleList = (
                await Schedule.where(
                    'teacherId',
                    '==',
                    auth()?.currentUser?.uid,
                )
                    .where('date', '==', date.toLocaleDateString())
                    .get()
            ).docs;

            resolve(scheduleList);
        });
    },
    getRange: ({
        start,
        end,
        classroomId,
    }: {
        start: Date | undefined;
        end: Date | undefined;
        classroomId: string;
    }) => {
        return new Promise(async (resolve, reject) => {
            let scheduleList = await Schedule.where(
                'classId',
                '==',
                classroomId,
            )
                .where('date', '>=', start?.toLocaleDateString())
                .where('date', '<=', end?.toLocaleDateString())
                .get();
            resolve(scheduleList);
        });
    },
    realTimeList: ({
        date,
        onResult,
    }: {
        date: Date;
        onResult: (snapshot: any) => void;
    }) => {
        return Schedule.where(
            'teacherId',
            '==',
            // Users.doc(auth()?.currentUser?.uid),
            auth()?.currentUser?.uid,
        )
            .where('date', '==', date.toLocaleDateString())
            .onSnapshot(onResult);
    },
    list: ({classroomId}: {classroomId: string}) => {
        return new Promise(async (resolve, reject) => {
            try {
                let scheduleList = await Schedule.where(
                    'classId',
                    '==',
                    classroomId,
                )
                    .orderBy('end', 'desc')
                    .get();
                resolve(scheduleList);
            } catch (error: any) {
                console.error(error);
                reject({
                    type: 'error',
                    message: error.code,
                });
            }
        });
    },
    mark: ({
        scheduleId,
        rollno,
        presentStudents,
        isPresent,
    }: {
        scheduleId: string;
        rollno: string;
        presentStudents: any;
        isPresent: boolean;
    }) => {
        return new Promise(async (resolve, reject) => {
            presentStudents[rollno] = isPresent;

            Schedule.doc(scheduleId)
                .update({
                    presentStudents: {...presentStudents},
                })
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
                    console.log(err);
                    reject(false);
                });
        });
    },
    getStats: ({classroomId}: {classroomId: string}) => {
        return new Promise(async (resolve, reject) => {
            try {
                let scheduleList = (
                    await Schedule.where('classId', '==', classroomId)
                        .orderBy('start', 'asc')
                        .get()
                ).docs;

                if (scheduleList.length === 0) {
                    throw new Error(
                        'Unable to load stats, there are no schedules',
                    );
                }

                let labels: string[] = [];
                let dataset: datasetTypes[] = [];

                let sum = 0;
                scheduleList.forEach((schedule: any) => {
                    labels.push(
                        schedule._data.date,
                        // +
                    );

                    let studentsPresent = 0;
                    for (let rollno in schedule._data.presentStudents) {
                        if (schedule._data.presentStudents[rollno])
                            studentsPresent++;
                    }
                    sum += studentsPresent;
                    dataset.push({
                        studentsPresent: studentsPresent,
                        time: `${formatedTime(
                            new Date(Number(schedule._data.start)),
                        )} - ${formatedTime(
                            new Date(Number(schedule._data.end)),
                        )}`,
                    });
                });

                resolve({
                    labels,
                    dataset,
                    avg: Math.floor(sum / scheduleList.length),
                });
            } catch (error: any) {
                console.log(error);
                reject({
                    type: 'error',
                    message: error.message,
                });
            }
        });
    },
};
