// src/app/(auth)/splash.tsx
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function SplashScreen() {
  const opacity = useSharedValue(1);

  const fadeOutAndNavigate = () => {
    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) runOnJS(router.replace)('/(auth)/login');
    });
  };

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.container, containerStyle]}>
        <AnimatedSplashOverlay onDismiss={fadeOutAndNavigate} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
  },
});
