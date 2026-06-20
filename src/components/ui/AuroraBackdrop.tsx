import { StyleSheet, View } from 'react-native';

export const AuroraBackdrop = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={styles.base} />
    <View style={styles.topGlow} />
    <View style={styles.sideGlow} />
    <View style={[styles.orb, styles.mintOrb]} />
    <View style={[styles.orb, styles.skyOrb]} />
    <View style={[styles.orb, styles.cyanOrb]} />
    <View style={styles.beam} />
    <View style={styles.hazeTop} />
    <View style={styles.hazeBottom} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#06101C',
  },
  beam: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    height: 1,
    left: '12%',
    position: 'absolute',
    right: '12%',
    top: 132,
  },
  orb: {
    borderRadius: 999,
    position: 'absolute',
  },
  cyanOrb: {
    backgroundColor: 'rgba(74, 195, 228, 0.12)',
    bottom: 90,
    height: 280,
    opacity: 0.75,
    right: -40,
    width: 280,
  },
  hazeBottom: {
    backgroundColor: 'rgba(130, 213, 177, 0.07)',
    borderRadius: 999,
    bottom: -70,
    height: 260,
    left: -30,
    position: 'absolute',
    width: 260,
  },
  hazeTop: {
    backgroundColor: 'rgba(244, 197, 123, 0.07)',
    borderRadius: 999,
    height: 220,
    position: 'absolute',
    right: -50,
    top: -10,
    width: 220,
  },
  mintOrb: {
    backgroundColor: 'rgba(130, 213, 177, 0.18)',
    height: 220,
    right: -30,
    top: 40,
    width: 220,
  },
  sideGlow: {
    backgroundColor: 'rgba(127, 199, 232, 0.08)',
    borderRadius: 999,
    height: 240,
    left: -120,
    position: 'absolute',
    top: 220,
    width: 240,
  },
  skyOrb: {
    backgroundColor: 'rgba(127, 199, 232, 0.12)',
    height: 180,
    left: -30,
    top: 130,
    width: 180,
  },
  topGlow: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    height: 180,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
