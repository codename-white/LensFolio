import { ImageOptimized } from '@/components/common/ImageOptimized';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { createBooking } from '@/services/bookingService';
import { getModelById } from '@/services/modelService';
import { ModelProfile } from '@/types';
import { resolveImageSource } from '@/utils/imageResolver';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ModelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [model, setModel] = useState<ModelProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadModel();
    }
  }, [id]);

  const loadModel = async () => {
    try {
      const data = await getModelById(id!);
      if (data) setModel(data);
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!model) return;

    Alert.alert(
      'Confirm Booking',
      `Would you like to book ${model.full_name || 'this model'} for ฿${model.hourly_rate}/hr?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: async () => {
            setIsBooking(true);
            try {
              const startTime = new Date().toISOString();
              const endTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour later
              await createBooking(user.id, model.id, startTime, endTime, model.hourly_rate);
              console.log('Booking successful, showing alert with Chat Now option');
              Alert.alert(
                'Booking Successful!', 
                `Your session with ${model.full_name} has been requested.`,
                [
                  {
                    text: 'Chat Now',
                    onPress: () => {
                      console.log('Navigating to chat with:', model.id);
                      router.push({
                        pathname: '/(tabs)/chat',
                        params: { receiverId: model.id, receiverName: model.full_name }
                      });
                    },
                    style: 'default',
                  },
                  {
                    text: 'Close',
                    onPress: () => router.back(),
                    style: 'cancel',
                  },
                ],
                { cancelable: false }
              );
            } catch (error: any) {
              Alert.alert('Booking Failed', error.message);
            } finally {
              setIsBooking(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  if (!model) {
    return (
      <View style={styles.centered}>
        <ThemedText>Model not found.</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: model.full_name || 'Model Detail', headerShown: true, headerTintColor: colors.gold }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ImageOptimized 
            source={resolveImageSource(
              (model.portfolio_images && model.portfolio_images.length > 0) 
                ? model.portfolio_images[0] 
                : model.avatar_url
            )} 
            style={styles.image} 
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.row}>
            <ThemedText type="title" style={{ color: colors.gold }}>฿{model.hourly_rate} / hr</ThemedText>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color={colors.gold} />
              <ThemedText style={styles.ratingText}>{model.rating} ({model.review_count} reviews)</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.bio}>{model.bio}</ThemedText>

          <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
          <View style={styles.chipContainer}>
            {model.categories.map((cat) => (
              <View key={cat} style={[styles.chip, { backgroundColor: colors.secondary }]}>
                <ThemedText style={styles.chipText}>{cat}</ThemedText>
              </View>
            ))}
          </View>

          <ThemedText style={styles.sectionTitle}>Location</ThemedText>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color={colors.icon} />
            <ThemedText style={styles.locationText}>{model.location.address}</ThemedText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            { backgroundColor: colors.gold, opacity: pressed || isBooking ? 0.8 : 1 }
          ]}
          onPress={handleBook}
          disabled={isBooking}
        >
          <ThemedText style={styles.bookButtonText}>
            {isBooking ? 'Processing...' : 'Book Session'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
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
  imageContainer: {
    height: 400,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 24,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    opacity: 0.7,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.1)',
  },
  bookButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
