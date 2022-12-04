import {View, Text, Dimensions, useColorScheme} from 'react-native';
import React, {useState, useRef} from 'react';
import ScreenWrapper from '../../Components/ScreenWrapper/index';
import {Anchor} from '../../Components/Buttons';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
} from 'react-native-chart-kit';
import spacing from '../../constants/spacing';
import {ScrollView} from 'react-native-gesture-handler';
import {light, dark} from '../../constants/theme';
import palette from '../../constants/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Heading4, Heading2, Heading3} from '../../Components/Typography';
import Schedule from '../../Queries/schedule';
import {showToast} from '../../Toast/Index';
import fontFamily from '../../constants/fontFamily';
const PIE_HEIGHT = Dimensions.get('screen').height / 4;
const WRAPPER_SIZE = PIE_HEIGHT * 0.6;
const screenWidth = Dimensions.get('screen').width - 2 * spacing.lg;
const rangeColor = (percentage: number, opacity: number) => {
    if (percentage >= 65) {
        return `#43ff40${Math.floor(opacity * 99)}`;
    } else if (percentage < 65 && percentage >= 30) {
        return `#FF9E40${Math.floor(opacity * 99)}`;
    } else return `#ff4a40${Math.floor(opacity * 99)}`;
};

const Charts = ({classroom}: {classroom: any}) => {
    const lightTheme = useColorScheme() === 'light';
    const ProgressRef = useRef<any>(null);
    const [selectedPercentage, setselectedPercentage] = useState(0);
    const chartConfig = {
        backgroundGradientFrom: lightTheme
            ? light.screenBackground
            : dark.screenBackground,
        backgroundGradientTo: lightTheme
            ? light.screenBackground
            : dark.screenBackground,
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) =>
            lightTheme ? light.active : palette.lightestBlue,
        labelColor: () => light.secondaryText,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '7',
            strokeWidth: '2',
            stroke: lightTheme ? palette.darkBlue : palette.primaryBlue,
        },
    };
    const [selectedIndex, setselectedIndex] = useState(0);
    const [selectedData, setselectedData] = useState(0);
    const [stats, setstats] = useState<any>();
    const [load, setload] = useState(false);
    const fetchStats = async () => {
        try {
            if (classroom.studentCount === 0) {
                showToast({
                    type: 'error',
                    message:
                        'Unable to load stats, there are no studnets in this classroom',
                });
                return;
            }
            const scheduleStats: any = await Schedule.getStats({
                classroomId: classroom.id,
            });
            setstats(scheduleStats);
            setload(true);
        } catch (e: any) {
            showToast({
                type: 'error',
                message: e.message,
            });
        }
    };
    return (
        <ScreenWrapper>
            <></>
            {load ? (
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <LineChart
                            data={{
                                labels: stats.labels,
                                datasets: [
                                    {
                                        data: stats.dataset.map(
                                            (dataset: any) =>
                                                dataset.studentsPresent,
                                        ),
                                    },
                                ],
                            }}
                            width={screenWidth * (stats.dataset.length / 3) * 2} // from react-native
                            height={Dimensions.get('window').height / 2}
                            yAxisInterval={10} // optional, defaults to 1
                            chartConfig={chartConfig}
                            fromZero={true}
                            bezier
                            formatYLabel={val => val.split('.')[0]}
                            onDataPointClick={({
                                index,
                                value,
                                dataset,
                                x,
                                y,
                                getColor,
                            }) => {
                                ProgressRef.current.open();

                                setselectedPercentage(
                                    Math.floor(
                                        (value / classroom.studentCount) * 100,
                                    ),
                                );
                                setselectedIndex(index);
                                setselectedData(value);
                            }}
                            style={{
                                marginVertical: 8,
                            }}
                        />
                    </ScrollView>
                    <Heading2
                        center>{`Average : ${stats.avg} students/class`}</Heading2>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Anchor onPress={fetchStats}>Load charts</Anchor>
                </View>
            )}
            <RBSheet
                ref={ProgressRef}
                animationType={'fade'}
                closeOnDragDown={true}
                height={PIE_HEIGHT * 1.25}
                openDuration={250}
                dragFromTopOnly={true}
                customStyles={{
                    wrapper: {
                        // backgroundColor: 'transparent',
                        elevation: 0,
                        zIndex: 0,
                    },
                    container: {
                        borderTopLeftRadius: spacing.lg,
                        borderTopRightRadius: spacing.lg,

                        paddingTop: spacing.sm,
                        backgroundColor: lightTheme
                            ? light.cardBackground
                            : dark.cardBackground,
                        elevation: 20,
                        // zIndex: 0,
                    },
                }}>
                <View style={{marginLeft: -90}}>
                    <ProgressChart
                        data={{
                            data: [0, -1, selectedPercentage / 100],
                        }}
                        width={screenWidth + 2 * spacing.lg}
                        height={PIE_HEIGHT}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={{
                            backgroundGradientFrom: lightTheme
                                ? light.cardBackground
                                : dark.cardBackground,
                            // backgroundGradientFromOpacity: 0,
                            backgroundGradientTo: lightTheme
                                ? light.cardBackground
                                : dark.cardBackground,
                            // backgroundGradientToOpacity: 0.5,
                            color: (opacity = 1) =>
                                rangeColor(selectedPercentage, opacity),
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                            useShadowColorFromDataset: false, // optional
                        }}
                        hideLegend={true}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            height: WRAPPER_SIZE,
                            width: WRAPPER_SIZE,
                            backgroundColor: lightTheme
                                ? light.cardBackground
                                : dark.cardBackground,
                            borderRadius: WRAPPER_SIZE,
                            left:
                                (screenWidth + 2 * spacing.lg) / 2 -
                                WRAPPER_SIZE / 2,
                            top: PIE_HEIGHT / 2 - WRAPPER_SIZE / 2,
                            // top: '25%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Heading4>{`${selectedPercentage}%`}</Heading4>
                        <Heading4>Students</Heading4>
                        <Heading4>present</Heading4>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: PIE_HEIGHT / 4,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                            <Heading4 muted>Date : </Heading4>
                            <Heading4>{stats?.labels[selectedIndex]}</Heading4>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Heading4 muted>Time : </Heading4>
                            <Heading4>
                                {stats?.dataset[selectedIndex].time}
                            </Heading4>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Heading4 muted>Present : </Heading4>
                            <Heading4>
                                {stats?.dataset[selectedIndex].studentsPresent}
                            </Heading4>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Heading4 muted>Absent : </Heading4>
                            <Heading4>
                                {classroom.studentCount -
                                    stats?.dataset[selectedIndex]
                                        .studentsPresent}
                            </Heading4>
                        </View>
                    </View>
                </View>
            </RBSheet>
        </ScreenWrapper>
    );
};

export default Charts;
