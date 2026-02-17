import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DiscoveryMap } from '@/components/ui/DiscoveryMap';
import { LocationSection } from '@/components/ui/LocationSection';
import { ModelCard } from '@/components/ui/ModelCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getModels, getRecommendedLocations } from '@/services/modelService';
import { ModelProfile, RecommendedLocation } from '@/types';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscoverScreen() {
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [locations, setLocations] = useState<RecommendedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      loadData();
    })();
  }, []);

  const loadData = async () => {
    try {
      const [modelsData, locationsData] = await Promise.all([
        getModels(),
        getRecommendedLocations(),
      ]);
      setModels(modelsData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = React.useCallback(({ item }: { item: ModelProfile }) => (
    <ModelCard model={item} onPress={() => router.push(`/model/${item.id}`)} />
  ), [router]);

  const keyExtractor = React.useCallback((item: ModelProfile) => item.id, []);

  const ListHeader = () => (
    <View>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={{ color: colors.gold }}>LensFolio</ThemedText>
        <ThemedText type="subtitle">Explore & Hire Models</ThemedText>
      </ThemedView>
      
      <DiscoveryMap 
        models={models}
        locations={locations}
        onMarkerPress={(item) => {
          if ((item as any).__type === 'model') {
            router.push(`/model/${item.id}`);
          } else {
            console.log('Location marker pressed:', item.name);
          }
        }} 
      />
      
      <LocationSection 
        locations={locations} 
        onPress={(loc) => console.log('Location pressed:', loc.name)} 
      />

      <ThemedView style={styles.listHeader}>
        <ThemedText type="defaultSemiBold">Available Models</ThemedText>
      </ThemedView>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.gold} />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={models}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        onRefresh={loadData}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});
