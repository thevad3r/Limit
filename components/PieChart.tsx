import React, {FC, useEffect} from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedProps,
  SharedValue,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { View } from 'react-native';

type PieChartProps = {
  size?: number;
  strokeWidth?: number;
};

export type PieChartDataItem = {
  color: string;
  percent: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type PieChartData = PieChartDataItem[];

export const PieChartSegment: FC<{
  center: number;
  radius: number;
  strokeWidth: number;
  color: string;
  circumference: number;
  angle: number;
  percent: number;
  progress: SharedValue<number>;
}> = ({
  center,
  radius,
  strokeWidth,
  circumference,
  color,
  angle,
  percent,
  progress,
}) => {
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 1],
      [circumference, circumference * (1 - percent)],
    );
    const rotateAngle = angle >= 0 ? interpolate(progress.value, [0, 1], [0, angle]) : 0;
    return {
        strokeDashoffset,
    };
  });

  return (
    <AnimatedCircle
    fillOpacity={0}
    cx={center}
    cy={center}
    r={radius}
    strokeWidth={strokeWidth}
    stroke={color}
    strokeDasharray={circumference}
    originX={center}
    originY={center}
    rotation={angle}
    animatedProps={animatedProps}
    />
  );
};

export const PieChart = ({size = 200, strokeWidth = 16, pieData}: PieChartProps & {pieData: any[]}) => {
  const progress = useSharedValue(0);
  const [data, setData] = React.useState<PieChartData>(pieData);
  const [startAngles, setStartAngles] = React.useState<number[]>([]);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const refresh = (data: any[]) => {

    let angle = 0;
    const angles: number[] = [];
    data.forEach(item => {
      angles.push(angle);
      angle += item.percent * 360;
    });

    setData(data);
    setStartAngles(angles);

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 1000,
    });
  };

  useEffect(() => {
    refresh(pieData);
  }, [pieData]);

  return (
    <View style={[{width: size, height: size, backgroundColor: 'transparent', transform: [{rotateZ: '-90deg'}],}]}>
        <Svg viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, index) => (
                <PieChartSegment
                key={`${item.color}-${index}`}
                center={center}
                radius={radius}
                circumference={circumference}
                angle={startAngles[index]}
                color={item.color}
                percent={item.percent}
                strokeWidth={strokeWidth}
                progress={progress}
                />
            ))}
        </Svg>
    </View>
  );
};