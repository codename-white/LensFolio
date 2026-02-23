import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { getMyModelDetails, updateModelDetails, updateProfile, uploadImage } from '@/services/profileService';
import { resolveImageSource } from '@/utils/imageResolver';

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [portfolioUris, setPortfolioUris] = useState<string[]>([]);
  const [existingPortfolio, setExistingPortfolio] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadDetails();
    }
  }, [user]);

  const loadDetails = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const details = await getMyModelDetails(user.id);
      if (details) {
        setBio(details.bio || '');
        setHourlyRate(String(details.hourly_rate || ''));
        setLocation(details.location_address || '');
        setExistingPortfolio(details.portfolio_images || []);
      }
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (type: 'avatar' | 'portfolio') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      if (type === 'avatar') {
        setAvatarUri(result.assets[0].uri);
      } else {
        setPortfolioUris([...portfolioUris, result.assets[0].uri]);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let finalAvatarUrl = user.avatar_url;
      if (avatarUri) {
        finalAvatarUrl = await uploadImage('avatars', `avatar-${user.id}-${Date.now()}.jpg`, avatarUri);
      }

      await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: finalAvatarUrl,
      });

      const uploadedPortfolio = await Promise.all(
        portfolioUris.map(async (uri, index) => {
          return await uploadImage('models', `portfolio-${user.id}-${Date.now()}-${index}.jpg`, uri);
        })
      );

      await updateModelDetails(user.id, {
        bio,
        hourly_rate: parseInt(hourlyRate) || 0,
        location_address: location,
        portfolio_images: [...existingPortfolio, ...uploadedPortfolio],
      });

      await refreshUser();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <ThemedText type="subtitle">Edit Profile</ThemedText>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color={colors.gold} />
              ) : (
                <ThemedText style={{ color: colors.gold, fontWeight: 'bold' }}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={() => pickImage('avatar')} style={styles.avatarContainer}>
              <Image 
                source={avatarUri ? { uri: avatarUri } : resolveImageSource(user?.avatar_url)} 
                style={styles.avatar} 
              />
              <View style={[styles.editBadge, { backgroundColor: colors.gold }]}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.secondary }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your Name"
              placeholderTextColor={colors.icon}
            />

            <ThemedText style={styles.label}>Bio</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.secondary }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.icon}
              multiline
              numberOfLines={4}
            />

            <ThemedText style={styles.label}>Hourly Rate (฿)</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.secondary }]}
              value={hourlyRate}
              onChangeText={setHourlyRate}
              placeholder="e.g. 1500"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
            />

            <ThemedText style={styles.label}>Location</ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.secondary }]}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Thonglor, Bangkok"
              placeholderTextColor={colors.icon}
            />
          </View>

          {/* Portfolio Section */}
          <View style={styles.portfolioSection}>
            <View style={styles.sectionHeader}>
              <ThemedText type="defaultSemiBold">Portfolio Photos</ThemedText>
              <TouchableOpacity onPress={() => pickImage('portfolio')} style={styles.addButton}>
                <Ionicons name="add-circle" size={24} color={colors.gold} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageGrid}>
              {[...existingPortfolio, ...portfolioUris].map((uri, index) => (
                <View key={index} style={styles.gridItem}>
                  <Image source={{ uri }} style={styles.gridImage} />
                  <TouchableOpacity 
                    style={styles.removeBtn}
                    onPress={() => {
                        if (index < existingPortfolio.length) {
                            setExistingPortfolio(existingPortfolio.filter((_, i) => i !== index));
                        } else {
                            setPortfolioUris(portfolioUris.filter((_, i) => i !== (index - existingPortfolio.length)));
                        }
                    }}
                  >
                    <Ionicons name="remove-circle" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={[styles.gridItem, styles.addPlaceholder, { borderColor: colors.secondary }]} onPress={() => pickImage('portfolio')}>
                <Ionicons name="camera-outline" size={32} color={colors.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 4,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  portfolioSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  addPlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
