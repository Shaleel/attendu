import React, {useMemo, useState} from 'react';
import {
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    Text,
    Pressable,
    ScrollView,
    VirtualizedList,
} from 'react-native';
import palette from '../../constants/colors';
import fontFamily from '../../constants/fontFamily';
import spacing from '../../constants/spacing';
import GestureRecognizer from 'react-native-swipe-detect'; //TODO uninstall

const {width} = Dimensions.get('window');
const ITEM_WIDTH = (width - spacing.lg) * 0.135;
const ITEM_HEIGHT = 70;
const ITEM_OFFSET = ITEM_WIDTH * 10;
interface Props {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

function dateSubtractDays(date: Date, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

function getDayString(date: Date): string {
    return date.toString().split(' ')[0];
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate();
}

function isToday(date: Date): boolean {
    return new Date().getDate() == date.getDate();
}

function generateHorizontalCalendarDates(days: number): Date[] {
    const today = new Date();
    let result = [];

    let prevDays = new Array(7).fill(undefined);
    let comingDays = new Array(7).fill(undefined);

    for (let i = 6; i >= 0; i--) {
        prevDays[i] = dateSubtractDays(today, 7 - i);
    }
    for (let i = 8; i <= 15; i++) {
        comingDays[i - 7 - 1] = dateSubtractDays(today, 7 - i);
    }

    // prevDays = prevDays.reverse();

    result.push(...prevDays);
    result.push(today);
    result.push(...comingDays);
    return result;
}

export default function HorizontalCalendar({
    selectedDate,
    setSelectedDate,
}: Props) {
    const dates: Date[] = useMemo(() => {
        return generateHorizontalCalendarDates(9);
    }, []);

    const onDatePress = (date: Date) => {
        setSelectedDate(date);
    };

    const renderItem = ({item, index}: {item: Date; index: number}) => {
        const dayNumber = item.getDate();
        const dayString = getDayString(item);
        const isActive = isSameDay(selectedDate, item);
        return (
            <Pressable
                key={item.toDateString()}
                onPress={() => onDatePress(item)}
                style={[
                    styles.item,
                    isActive && {backgroundColor: palette.primaryBlue},
                ]}>
                <Text
                    style={[
                        styles.dateOutput,
                        isToday(item) && styles.today,
                        isActive && styles.activeText,
                    ]}>
                    {dayNumber}
                </Text>
                <Text
                    style={[
                        styles.dayStyle,
                        isToday(item) && styles.today,
                        isActive && styles.activeText,
                    ]}>
                    {isToday(item) ? 'today' : dayString}
                </Text>
            </Pressable>
        );
    };

    return (
        <FlatList
            style={styles.wrapper}
            data={dates}
            renderItem={renderItem}
            keyExtractor={item => item.toDateString()}
            horizontal={true}
            contentContainerStyle={[{}]}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={10}
            // removeClippedSubviews={false}
            decelerationRate="fast"
        />
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: palette.lightBlue,
        borderTopLeftRadius: spacing.md,
        borderTopRightRadius: spacing.md,
        elevation: 0,
    },
    dateOutput: {
        color: palette.primaryBlue,
        fontFamily: fontFamily.Bold,
        fontSize: 18,
    },
    dayStyle: {
        color: palette.primaryBlue,
        fontFamily: fontFamily.Medium,

        textTransform: 'lowercase',
    },
    activeText: {
        color: palette.white,
    },
    today: {
        color: palette.darkYellow,
    },
    item: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 8,
    },
});
