import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RecommendedLocation } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ThemedText } from '../themed-text';

const { width } = Dimensions.get('window');

interface DiscoveryMapProps {
  models: ModelProfile[];
  locations: RecommendedLocation[];
  onMarkerPress?: (item: ModelProfile | RecommendedLocation) => void;
}

export const DiscoveryMap: React.FC<DiscoveryMapProps> = ({ models, locations, onMarkerPress }) => {
  const [selectedItem, setSelectedItem] = useState<ModelProfile | RecommendedLocation | null>(null);
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const initialRegion = {
    latitude: 13.7367, // Center around Bangkok hotspots
    longitude: 100.5331,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        userInterfaceStyle={colorScheme}
        showsUserLocation={true}
      >
        {/* Model Markers (Gold) */}
        {models.map((model) => (
          <Marker
            key={`model-${model.id}`}
            coordinate={{
              latitude: Number(model.latitude) || 13.7563,
              longitude: Number(model.longitude) || 100.5018,
            }}
            title={model.full_name}
            pinColor={colors.gold}
            onPress={() => setSelectedItem(model)}
          />
        ))}

        {/* Location Markers (Blue) - Slightly Offset if same as model */}
        {locations.map((location) => (
          <Marker
            key={`loc-${location.id}`}
            coordinate={{
              latitude: Number(location.latitude) || 13.7563,
              longitude: Number(location.longitude) || 100.5018,
            }}
            title={location.name}
            pinColor="#007AFF"
            onPress={() => setSelectedItem(location)}
          />
        ))}
      </MapView>

      {/* Floating Info Card */}
      {selectedItem && (
        <View style={[styles.floatingCard, { backgroundColor: colors.background }]}>
          <View style={styles.cardContent}>
            <Image 
              source={{ 
                uri: (selectedItem as any).__type === 'model'
                  ? (selectedItem as any).portfolio_images?.[0]
                  : (selectedItem as any).image_url || 'https://via.placeholder.com/150'
              }} 
              style={styles.cardImage} 
            />
            <View style={styles.cardInfo}>
              <ThemedText style={styles.cardName} numberOfLines={1}>
                {(selectedItem as any).__type === 'model' 
                  ? (selectedItem as any).full_name 
                  : (selectedItem as any).name}
              </ThemedText>
              
              <ThemedText numberOfLines={1} style={[styles.cardDescription, { fontSize: 13, color: '#888' }]}>
                {(selectedItem as any).__type === 'model' 
                  ? (selectedItem as any).bio 
                  : (selectedItem as any).description}
              </ThemedText>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.gold} />
                <ThemedText style={styles.cardRating}>{selectedItem.rating}</ThemedText>
                <ThemedText style={styles.cardCategory}> 
                  • {(selectedItem as any).__type === 'model' ? 'Model' : (selectedItem as any).category}
                </ThemedText>
              </View>
              <View style={styles.cardButtons}>
                <View style={styles.viewButtons}>
                  <ThemedText 
                    style={[styles.btnText, { color: colors.gold }]}
                    onPress={() => onMarkerPress?.(selectedItem)}
                  >
                    View Details
                  </ThemedText>
                </View>
              </View>
            </View>
            <Ionicons 
              name="close-circle" 
              size={24} 
              color={colors.icon} 
              onPress={() => setSelectedItem(null)}
              style={styles.closeBtn}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: width,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 13,
    color: '#888',
  },
  cardRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardCategory: {
    fontSize: 12,
    color: '#888',
  },
  cardButtons: {
    marginTop: 4,
  },
  viewButtons: {
    flexDirection: 'row',
  },
  btnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
