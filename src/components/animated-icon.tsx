// components/animated-icon.tsx
import { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashOverlayProps {
  onDismiss?: () => void;
}

export function AnimatedSplashOverlay({
  onDismiss,
}: AnimatedSplashOverlayProps) {
  const insets = useSafeAreaInsets();

  // ── icon pulse ──────────────────────────────────────────
  const iconScale = useSharedValue(1);
  const pingScale = useSharedValue(1);
  const pingOpacity = useSharedValue(0.75);

  // ── entrance animations ─────────────────────────────────
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(24);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    // Breathing pulse on icon container
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Ping ring
    pingScale.value = withRepeat(
      withTiming(1.8, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    pingOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 1800 }),
      ),
      -1,
      false,
    );

    // Staggered entrance
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    logoTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) }),
    );
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    footerOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
  }, []);

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const pingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pingScale.value }],
    opacity: pingOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));
  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* ── background glows ── */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      {/* ── spacer ── */}
      <View style={{ height: insets.top + 40 }} />

      {/* ── brand center ── */}
      <View style={styles.brandSection}>
        <Animated.View style={[styles.iconWrapper, logoStyle]}>
          {/* ping ring */}
          <Animated.View style={[styles.ping, pingStyle]} />

          {/* icon container */}
          <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
            <BrainCircuit size={64} color='#34d399' strokeWidth={1.5} />
          </Animated.View>
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>
          FOREMIND
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Listas Inteligentes & Geofencing
        </Animated.Text>
      </View>

      {/* ── footer ── */}
      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + 32 },
          footerStyle,
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={onDismiss}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>

        <View style={styles.copyright}>
          <Text style={styles.copyrightTop}>
            SOPORTE MULTIPLATAFORMA • EXPONENCIAL
          </Text>
          <Text style={styles.copyrightBottom}>© Dolimer Martinez</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── glows ──
  glow: {
    position: 'absolute',
    borderRadius: 9999,
  },
  glowTop: {
    width: 300,
    height: 300,
    top: height * 0.15,
    left: width / 2 - 150,
    backgroundColor: 'rgba(16, 185, 129, 0.08)', // emerald-500/10 approx
    // RN doesn't support blur — we stack semi-transparent circles
    // for a soft glow effect
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
  },
  glowBottom: {
    width: 260,
    height: 260,
    bottom: height * 0.2,
    left: width / 2 - 130,
    backgroundColor: 'rgba(59, 130, 246, 0.08)', // blue-500/10
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 80,
  },

  // ── brand ──
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ping: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
  },
  iconContainer: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    // gradient approximated with bg — for real gradient use expo-linear-gradient
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#34d399', // emerald-400 — gradient not possible in Text without lib
    // For true gradient text: use MaskedView + LinearGradient
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#94a3b8', // slate-400
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // ── footer ──
  footer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#10b981', // emerald-500 — use LinearGradient for full match
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#020617', // slate-950
    letterSpacing: 1,
  },
  copyright: {
    alignItems: 'center',
    gap: 4,
  },
  copyrightTop: {
    fontSize: 9,
    color: '#475569', // slate-600
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textTransform: 'uppercase',
  },
  copyrightBottom: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
});
