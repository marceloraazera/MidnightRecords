import React from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { usePathname, useSegments } from 'expo-router';
import LottieView from 'lottie-react-native';

const loadingAnimation = require('../assets/animations/animação.json');
const TRANSITION_DURATION_MS = 520;

const getScreenName = (pathname, segments) => {
  const currentSegments = segments ?? [];

  if (currentSegments.includes('carrinho') || pathname?.includes('/carrinho')) {
    return 'carrinho';
  }

  if (currentSegments.includes('detalhes') || pathname?.includes('/detalhes')) {
    return 'detalhes';
  }

  if (currentSegments.includes('favoritos') || pathname?.includes('/favoritos')) {
    return 'favoritos';
  }

  if (currentSegments.includes('add') || pathname?.includes('/add')) {
    return 'add';
  }

  if (currentSegments.includes('perfil') || pathname?.includes('/perfil')) {
    return 'perfil';
  }

  if (currentSegments.includes('(tabs)')) {
    return 'home';
  }

  if (pathname === '/' || currentSegments.includes('index')) {
    return 'login';
  }

  return pathname ?? currentSegments.join('/');
};

const shouldShowLoading = (fromScreen, toScreen) => {
  if (!fromScreen || !toScreen || fromScreen === toScreen) {
    return false;
  }

  return (
    (fromScreen === 'login' && toScreen === 'home') ||
    toScreen === 'carrinho' ||
    (fromScreen === 'home' && toScreen === 'detalhes') ||
    (fromScreen !== 'login' && toScreen === 'login')
  );
};

export default function RouteLoadingOverlay() {
  const pathname = usePathname();
  const segments = useSegments();
  const screenName = getScreenName(pathname, segments);
  const previousScreenName = React.useRef(screenName);
  const [visible, setVisible] = React.useState(false);
  const { width, height } = useWindowDimensions();

  React.useEffect(() => {
    const fromScreen = previousScreenName.current;
    const toScreen = screenName;

    previousScreenName.current = toScreen;

    if (!shouldShowLoading(fromScreen, toScreen)) {
      return undefined;
    }

    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, TRANSITION_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [screenName]);

  if (!visible) {
    return null;
  }

  const overlay = (
    <View style={[styles.overlay, Platform.OS === 'web' && styles.webOverlay, Platform.OS === 'web' && { width, height }]}>
      <View style={styles.content}>
        <LottieView
          source={loadingAnimation}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    </View>
  );

  if (Platform.OS === 'web' && typeof document !== 'undefined' && document.body) {
    const { createPortal } = require('react-dom');
    return createPortal(overlay, document.body);
  }

  return overlay;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(21, 16, 31, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
    elevation: 99999,
  },
  webOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    maxWidth: '100vw',
    maxHeight: '100vh',
  },
  content: {
    width: 180,
    maxWidth: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 110,
    height: 110,
  },
  text: {
    marginTop: 6,
    color: '#F1F6B3',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
});
