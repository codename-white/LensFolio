import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const ProfileStat = ({ label, value }: { label: string; value: string | number }) => (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );

  const MenuEntry = ({ icon, title, onPress, color }: { icon: any; title: string; onPress: () => void; color?: string }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <IconSymbol name={icon} size={22} color={color || colors.text} />
      </View>
      <ThemedText style={[styles.menuTitle, color ? { color } : {}]}>{title}</ThemedText>
      <IconSymbol name="chevron.right" size={20} color={colors.icon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / Avatar Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.gold }]}>
              <IconSymbol name="plus.circle.fill" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.userName}>
            {user?.full_name || 'Guest User'}
          </ThemedText>
          <ThemedText style={styles.userRole}>
            {user?.role === 'model' ? 'Professional Model' : 'Photographer'}
          </ThemedText>
        </View>

        {user?.account_status === 'pending' && (
          <View style={[styles.pendingBanner, { backgroundColor: colors.gold + '20' }]}>
            <IconSymbol name="hourglass.fill" size={20} color={colors.gold} />
            <ThemedText style={[styles.pendingText, { color: colors.gold }]}>
              Account pending approval. You won't be visible to others yet.
            </ThemedText>
          </View>
        )}

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: colors.secondary }]}>
          <ProfileStat label="Bookings" value={12} />
          <View style={styles.statDivider} />
          <ProfileStat label="Rating" value="4.9" />
          <View style={styles.statDivider} />
          <ProfileStat label="Reviews" value={45} />
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <MenuEntry 
            icon="person.fill" 
            title="Edit Profile" 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/profile/edit' as any);
            }} 
          />
          <MenuEntry icon="bell.fill" title="Notifications" onPress={() => {}} />
          <MenuEntry icon="gearshape.fill" title="Settings" onPress={() => {}} />
        </View>

        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Support</ThemedText>
          <MenuEntry icon="paperplane.fill" title="Help Center" onPress={() => {}} />
          <MenuEntry icon="logout.fill" title="Logout" onPress={handleLogout} color="#FF3B30" />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.versionText}>LensFolio v1.0.0</ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#D4AF37',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#888',
    fontFamily: Fonts.rounded,
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  pendingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    color: '#888',
    fontSize: 12,
  },
});
