// Vitta+ Travel Screen — app/travel.tsx
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
import { getTravelPackages, TravelPackage } from '@/services/travelService';
import { TravelCard } from '@/components/feature/TravelCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { VittaButton } from '@/components/ui/VittaButton';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const FILTER_OPTIONS = [
  { key: 'todos', label: 'Todos' },
  { key: 'cruzeiro', label: 'Cruzeiros' },
  { key: 'grupo', label: 'Grupos' },
  { key: 'bem_estar', label: 'Bem-Estar' },
  { key: 'cultural', label: 'Cultural' },
];

export default function TravelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem } = useAgenda();
  const { showAlert } = useAlert();
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);

  const allPackages = getTravelPackages();
  const filtered = selectedFilter === 'todos'
    ? allPackages
    : allPackages.filter((p) => p.type === selectedFilter);

  const handleExpressInterest = (pkg: TravelPackage) => {
    addItem({
      type: 'viagem',
      typeLabel: 'Viagem',
      title: pkg.title,
      subtitle: `${pkg.destination} — Consultor entrará em contato`,
      date: pkg.departureDate,
      dateLabel: pkg.departureDate,
      time: '00:00',
      color: Colors.travel,
      icon: 'flight',
      confirmed: false,
    });
    setSelectedPackage(null);
    showAlert(
      'Interesse registrado!',
      `Nossa consultora de viagens entrará em contato em breve para falar sobre a viagem "${pkg.title}". Verifique sua agenda para acompanhar.`
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/travel_hero.jpg')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Viajar é viver</Text>
          <Text style={styles.heroSubtitle}>
            Pacotes criados com calma e cuidado para você aproveitar cada destino
          </Text>
        </View>
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => setSelectedFilter(opt.key)}
              style={[
                styles.filterChip,
                selectedFilter === opt.key && styles.filterChipSelected,
              ]}
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
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="info-outline" size={18} color={Colors.travel} />
          <Text style={styles.infoBannerText}>
            Todos os nossos pacotes incluem assistência 24h e suporte em português.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={`${filtered.length} pacote${filtered.length !== 1 ? 's' : ''} disponível${filtered.length !== 1 ? 'is' : ''}`}
            subtitle="Toque para ver detalhes e expressar interesse"
            accentColor={Colors.travel}
          />
          {filtered.map((pkg) => (
            <TravelCard
              key={pkg.id}
              pkg={pkg}
              onPress={() => setSelectedPackage(pkg)}
            />
          ))}
        </View>

        {/* Contact banner */}
        <View style={[styles.section, { marginBottom: 0 }]}>
          <Pressable
            style={({ pressed }) => [styles.contactBanner, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <MaterialIcons name="headset-mic" size={24} color={Colors.textOnPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactBannerTitle}>Prefere conversar antes?</Text>
              <Text style={styles.contactBannerSub}>Nossa consultora Ana Clara está disponível agora</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textOnPrimary} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Package Detail Modal */}
      {selectedPackage ? (
        <Modal visible animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
              <View style={styles.modalHandle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedPackage.imageUrl }}
                  style={styles.modalImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.modalBody}>
                  <View style={styles.modalBadgeRow}>
                    <View style={styles.modalBadge}>
                      <Text style={styles.modalBadgeText}>{selectedPackage.typeLabel}</Text>
                    </View>
                    {selectedPackage.availableSpots <= 5 ? (
                      <View style={styles.urgencyBadge}>
                        <Text style={styles.urgencyText}>Últimas {selectedPackage.availableSpots} vagas</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.modalTitle}>{selectedPackage.title}</Text>
                  <View style={styles.metaRow}>
                    <MaterialIcons name="location-on" size={15} color={Colors.travel} />
                    <Text style={styles.metaText}>{selectedPackage.destination}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <MaterialIcons name="schedule" size={15} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{selectedPackage.duration} · {selectedPackage.departureDate}</Text>
                  </View>

                  <Text style={styles.modalDescription}>{selectedPackage.description}</Text>

                  <Text style={styles.subSectionTitle}>O que está incluso</Text>
                  {selectedPackage.highlights.map((h, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <MaterialIcons name="check-circle" size={16} color={Colors.success} />
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}

                  <Text style={styles.subSectionTitle}>Acessibilidade</Text>
                  {selectedPackage.accessibility.map((a, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <MaterialIcons name="accessibility-new" size={16} color={Colors.travel} />
                      <Text style={styles.bulletText}>{a}</Text>
                    </View>
                  ))}

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceLabel}>A partir de</Text>
                      <Text style={styles.priceValue}>{selectedPackage.priceLabel}</Text>
                    </View>
                    <View style={styles.ratingBox}>
                      <MaterialIcons name="star" size={16} color={Colors.education} />
                      <Text style={styles.ratingText}>{selectedPackage.rating}</Text>
                      <Text style={styles.ratingCount}>({selectedPackage.reviewCount} avaliações)</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
                  onPress={() => setSelectedPackage(null)}
                >
                  <Text style={styles.closeBtnText}>Fechar</Text>
                </Pressable>
                <VittaButton
                  label="Tenho interesse!"
                  onPress={() => handleExpressInterest(selectedPackage)}
                  icon="favorite"
                  accentColor={Colors.travel}
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
  hero: { height: 180, position: 'relative', overflow: 'hidden' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(100,30,10,0.55)',
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
    lineHeight: 20,
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
    backgroundColor: Colors.travel,
    borderColor: Colors.travel,
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
    backgroundColor: Colors.travelLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.travel,
  },
  infoBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  contactBanner: {
    backgroundColor: Colors.travel,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  contactBannerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  contactBannerSub: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
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
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  modalImage: { width: '100%', height: 200 },
  modalBody: { padding: Spacing.md },
  modalBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  modalBadge: {
    backgroundColor: Colors.travel,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  modalBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  urgencyBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  urgencyText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  modalDescription: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  subSectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  bulletText: {
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
  priceLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  priceValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.travel,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  ratingCount: {
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
