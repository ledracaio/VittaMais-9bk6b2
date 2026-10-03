// Vitta+ Travel Card — components/feature/TravelCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { TravelPackage } from '@/services/travelService';
import { Colors, Radius, FontSize, FontWeight, Spacing, Shadow } from '@/constants/theme';

interface TravelCardProps {
  pkg: TravelPackage;
  onPress: () => void;
  compact?: boolean;
}

export function TravelCard({ pkg, onPress, compact = false }: TravelCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(pkg.rating));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
      ]}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: pkg.imageUrl }}
        style={[styles.image, compact && styles.compactImage]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{pkg.typeLabel}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{pkg.title}</Text>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={14} color={Colors.textMuted} />
          <Text style={styles.destination} numberOfLines={1}>{pkg.destination}</Text>
        </View>
        <View style={styles.meta}>
          <View style={styles.row}>
            <MaterialIcons name="schedule" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{pkg.duration}</Text>
          </View>
          <View style={styles.row}>
            <MaterialIcons name="event" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{pkg.departureDate}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{pkg.priceLabel}</Text>
            <View style={styles.stars}>
              {stars.map((filled, i) => (
                <MaterialIcons
                  key={i}
                  name={filled ? 'star' : 'star-border'}
                  size={12}
                  color={Colors.education}
                />
              ))}
              <Text style={styles.reviewCount}>({pkg.reviewCount})</Text>
            </View>
          </View>
          {pkg.availableSpots <= 5 ? (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>Últimas {pkg.availableSpots} vagas</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  compactCard: {
    width: 260,
    marginBottom: 0,
    marginRight: Spacing.md,
  },
  image: { width: '100%', height: 180 },
  compactImage: { height: 150 },
  overlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  typeBadge: {
    backgroundColor: Colors.travel,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  typeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  body: { padding: Spacing.md },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  destination: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.travel,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  reviewCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  urgencyBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
});
