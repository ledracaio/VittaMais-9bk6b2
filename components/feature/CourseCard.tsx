// Vitta+ Course Card — components/feature/CourseCard.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Course } from '@/services/educationService';
import { Colors, Radius, FontSize, FontWeight, Spacing, Shadow } from '@/constants/theme';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const categoryColors: Record<Course['category'], string> = {
  financas: Colors.finance,
  tecnologia: '#5B7FA6',
  saude: Colors.health,
  artes: '#8B6BAE',
  bem_estar: Colors.primary,
};

export function CourseCard({ course, onPress }: CourseCardProps) {
  const catColor = categoryColors[course.category] ?? Colors.primary;
  const spotsLeft = course.maxStudents - course.enrolledCount;
  const isFull = spotsLeft <= 0;
  const isFree = course.price === 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.accentBar, { backgroundColor: catColor }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{course.categoryLabel}</Text>
          </View>
          {isFree ? (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>Gratuito</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.instructor}>{course.instructor}</Text>
        <Text style={styles.instructorTitle} numberOfLines={1}>{course.instructorTitle}</Text>
        <Text style={styles.description} numberOfLines={2}>{course.description}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{course.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="computer" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{course.formatLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="event" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{course.startDate}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, isFree && { color: Colors.success }]}>
              {course.priceLabel}
            </Text>
            {!isFull ? (
              <Text style={styles.spots}>{spotsLeft} vagas disponíveis</Text>
            ) : (
              <Text style={[styles.spots, { color: Colors.error }]}>Turma lotada</Text>
            )}
          </View>
          <View style={styles.schedule}>
            <MaterialIcons name="access-time" size={13} color={Colors.textMuted} />
            <Text style={styles.scheduleText}>{course.schedule}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  accentBar: { width: 5 },
  body: { flex: 1, padding: Spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  freeBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  freeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  instructor: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  instructorTitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.education,
  },
  spots: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  schedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
