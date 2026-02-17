import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RecommendedLocation } from '@/types';
import React from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ImageOptimized } from '../common/ImageOptimized';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');

interface LocationSectionProps {
  locations: RecommendedLocation[];
  onPress?: (location: RecommendedLocation) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ locations, onPress }) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const renderItem = ({ item }: { item: RecommendedLocation }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.card, 
        { backgroundColor: colors.secondary, opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={() => onPress?.(item)}
    >
      <ImageOptimized source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.overlay}>
        <ThemedText style={styles.category}>{item.category}</ThemedText>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={{ color: colors.gold }}>Recommended Locations</ThemedText>
        <ThemedText style={styles.seeAll}>See All</ThemedText>
      </View>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={width * 0.7 + 16}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: '#D4AF37', // Gold
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  card: {
    width: width * 0.7,
    height: 180,
    borderRadius: 20,
    marginHorizontal: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  category: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
