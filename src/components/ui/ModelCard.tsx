import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { ModelProfile } from '../../types';
import { ImageOptimized } from '../common/ImageOptimized';

import { resolveImageSource } from '../../utils/imageResolver';

interface ModelCardProps {
  model: ModelProfile;
  onPress?: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = React.memo(({ model, onPress }) => {
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.secondary, opacity: pressed ? 0.9 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <ImageOptimized
          source={resolveImageSource(model.portfolio_images[0])}
          style={styles.image}
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={colors.gold} />
          <Text style={styles.ratingText}>{model.rating}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{model.full_name || 'Anonymous Model'}</Text>
        <Text style={[styles.price, { color: colors.gold }]}>
          ฿{model.hourly_rate} / hr
        </Text>
        <Text style={[styles.bio, { color: colors.icon }]} numberOfLines={2}>
          {model.bio}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  imageContainer: {
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
  },
});
