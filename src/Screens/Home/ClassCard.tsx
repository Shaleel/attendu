import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card} from '../../Components/Card';
import {Heading2, Text, Heading3} from '../../Components/Typography';

type props = {
    name: string;
    description?: string;
    studentCount: number;
    accentColor: string;
};
const ClassCard = ({name, description, studentCount, accentColor}: props) => {
    return (
        <Card padding="lg" bg={accentColor}>
            <View style={styles.row}>
                <View style={{flex: 0.8}}>
                    <Heading2 light>{name}</Heading2>
                    {description ? (
                        <Text bold light>
                            {description}
                        </Text>
                    ) : (
                        <></>
                    )}
                </View>

                <View>
                    <Heading3 center light>
                        {studentCount}
                    </Heading3>
                    <Text bold light>
                        Students
                    </Text>
                </View>
            </View>
        </Card>
    );
};

export default ClassCard;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
