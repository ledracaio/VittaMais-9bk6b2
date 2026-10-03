// Vitta+ Education Screen — app/education.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAgenda } from '@/hooks/useAgenda';
import { useAlert } from '@/template';
import { getCourses, Course } from '@/services/educationService';
import { CourseCard } from '@/components/feature/CourseCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { VittaButton } from '@/components/ui/VittaButton';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'financas', label: 'Finanças' },
  { key: 'tecnologia', label: 'Tecnologia' },
  { key: 'saude', label: 'Saúde' },
  { key: 'artes', label: 'Artes' },
  { key: 'bem_estar', label: 'Bem-Estar' },
];

export default function EducationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useAgenda();
  const { showAlert } = useAlert();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const allCourses = getCourses();
  const filtered = selectedFilter === 'todos'
    ? allCourses
    : allCourses.filter((c) => c.category === selectedFilter as Course['category']);

  const freeCourses = allCourses.filter((c) => c.price === 0);

  const handleEnroll = (course: Course) => {
    addItem({
      type: 'curso',
      typeLabel: 'Curso',
      title: course.title,
      subtitle: `${course.instructor} · ${course.formatLabel}`,
      date: '2025-07-10',
      dateLabel: course.startDate,
      time: course.schedule.includes(',') ? course.schedule.split(',')[1].trim().split(' ')[0] : '09:00',
      color: Colors.education,
      icon: 'school',
      confirmed: true,
    });
    setSelectedCourse(null);
    showAlert(
      'Inscrição confirmada!',
      `Você está inscrito em "${course.title}" com ${course.instructor}. O compromisso foi adicionado à sua agenda.`
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/education_hero.jpg')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Nunca pare de aprender</Text>
          <Text style={styles.heroSubtitle}>{freeCourses.length} cursos gratuitos disponíveis agora</Text>
        </View>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setSelectedFilter(opt.key)}
              style={[styles.filterChip, selectedFilter === opt.key && styles.filterChipSelected]}
            >
              <Text style={[styles.filterChipText, selectedFilter === opt.key && styles.filterChipTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxxl }]}
      >
        {/* Info */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="school" size={18} color={Colors.education} />
          <Text style={styles.infoBannerText}>
            Aulas ao vivo com professores reais. Turmas pequenas para atenção personalizada.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={`${filtered.length} curso${filtered.length !== 1 ? 's' : ''}`}
            subtitle="Toque para ver detalhes e se inscrever"
            accentColor={Colors.education}
          />
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => setSelectedCourse(course)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Course Detail Modal */}
      {selectedCourse ? (
        <Modal visible animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
              <View style={styles.modalHandle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalBody}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: Colors.educationLight }]}>
                      <Text style={[styles.categoryBadgeText, { color: Colors.education }]}>
                        {selectedCourse.categoryLabel}
                      </Text>
                    </View>
                    {selectedCourse.price === 0 ? (
                      <View style={[styles.categoryBadge, { backgroundColor: Colors.successLight }]}>
                        <Text style={[styles.categoryBadgeText, { color: Colors.success }]}>Gratuito</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
                  <Text style={styles.instructorName}>{selectedCourse.instructor}</Text>
                  <Text style={styles.instructorTitle}>{selectedCourse.instructorTitle}</Text>

                  <Text style={styles.descriptionText}>{selectedCourse.description}</Text>

                  <View style={styles.metaGrid}>
                    {[
                      { icon: 'schedule', label: 'Duração', value: selectedCourse.duration },
                      { icon: 'computer', label: 'Formato', value: selectedCourse.formatLabel },
                      { icon: 'access-time', label: 'Horário', value: selectedCourse.schedule },
                      { icon: 'event', label: 'Início', value: selectedCourse.startDate },
                      { icon: 'signal-cellular-alt', label: 'Nível', value: selectedCourse.levelLabel },
                      { icon: 'group', label: 'Vagas', value: `${selectedCourse.maxStudents - selectedCourse.enrolledCount} restantes` },
                    ].map((m) => (
                      <View key={m.label} style={styles.metaItem}>
                        <MaterialIcons name={m.icon as any} size={16} color={Colors.education} />
                        <View>
                          <Text style={styles.metaLabel}>{m.label}</Text>
                          <Text style={styles.metaValue}>{m.value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.topicsTitle}>O que você vai aprender</Text>
                  {selectedCourse.topics.map((topic, i) => (
                    <View key={i} style={styles.topicRow}>
                      <MaterialIcons name="check-circle" size={16} color={Colors.education} />
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceLabel}>Investimento</Text>
                      <Text style={[styles.priceValue, selectedCourse.price === 0 && { color: Colors.success }]}>
                        {selectedCourse.priceLabel}
                      </Text>
                    </View>
                    <View style={styles.ratingBox}>
                      <MaterialIcons name="star" size={16} color={Colors.education} />
                      <Text style={styles.ratingText}>{selectedCourse.rating}</Text>
                      <Text style={styles.enrolledCount}>{selectedCourse.enrolledCount} inscritos</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
                  onPress={() => setSelectedCourse(null)}
                >
                  <Text style={styles.closeBtnText}>Fechar</Text>
                </Pressable>
                <VittaButton
                  label="Quero me inscrever"
                  onPress={() => handleEnroll(selectedCourse)}
                  icon="school"
                  accentColor={Colors.education}
                  style={{ flex: 2 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 170, position: 'relative', overflow: 'hidden' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,50,5,0.6)',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  filterBar: {
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.education,
    borderColor: Colors.education,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterChipTextSelected: { color: Colors.textOnPrimary },

  content: { padding: Spacing.md },
  section: { marginBottom: Spacing.md },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.educationLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.education,
  },
  infoBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(44,40,38,0.6)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '92%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: Spacing.sm,
  },
  modalBody: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  categoryBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  instructorName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.education,
  },
  instructorTitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  descriptionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    width: '47%',
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  topicsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  topicText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  priceValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.education,
  },
  ratingBox: { alignItems: 'flex-end', gap: 2 },
  ratingText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enrolledCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  closeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
});
