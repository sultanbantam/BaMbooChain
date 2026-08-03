import { useEffect, useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, usePathname } from 'expo-router';

const MAIN_SITE_HOST = 'https://www.bamboochain.id';
const MAIN_SITE_PREFIXES = new Set([
  'about',
  'academy',
  'bambunusa',
  'bambupedia',
  'bamboochain',
  'careers',
  'community',
  'contact',
  'data-tools',
  'events',
  'faq',
  'impact',
  'insight',
  'partners',
  'portfolio',
  'projects',
  'tobat-ekologi',
  'transparency',
]);

const getMainSiteUrl = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const firstSegment = normalizedPath.split('/').filter(Boolean)[0];

  if (!firstSegment || !MAIN_SITE_PREFIXES.has(firstSegment)) return null;
  return `${MAIN_SITE_HOST}/#${normalizedPath}`;
};

export default function NotFoundScreen() {
  const pathname = usePathname();
  const mainSiteUrl = useMemo(() => getMainSiteUrl(pathname), [pathname]);

  useEffect(() => {
    if (mainSiteUrl && typeof window !== 'undefined') {
      window.location.replace(mainSiteUrl);
    }
  }, [mainSiteUrl]);

  const openMainSite = () => {
    if (mainSiteUrl) Linking.openURL(mainSiteUrl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mainSiteUrl ? 'Mengalihkan...' : 'Halaman tidak tersedia'}</Text>
      <Text style={styles.subtitle}>
        {mainSiteUrl
          ? 'Halaman ini berada di website BaMbooChain.'
          : 'BambooChat hanya memuat kontak, chat, login, dan pendaftaran.'}
      </Text>
      {mainSiteUrl ? (
        <TouchableOpacity style={styles.primaryButton} onPress={openMainSite}>
          <Text style={styles.primaryButtonText}>Buka BaMbooChain</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(main)/contacts')}>
          <Text style={styles.primaryButtonText}>Kembali ke BambooChat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0F172A',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 420,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});