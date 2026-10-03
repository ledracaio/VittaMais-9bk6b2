// Vitta+ Home Screen — app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { useAgenda } from '@/hooks/useAgenda';
import { useHealth } from '@/hooks/useHealth';
import { ModuleCard } from '@/components/feature/ModuleCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';
import { moodEmoji } from '@/services/healthService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { getUpcomingItems } = useAgenda();
  const { getTodayLog, getAverageMood } = useHealth();

  const upcomingItems = getUpcomingItems().slice(0, 2);
  const todayLog = getTodayLog();
  const avgMood = getAverageMood();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const modules = [
    { label: 'Viagens', icon: 'flight' as const, color: Colors.travel, background: Colors.travelLight, route: '/travel' },
    { label: 'Educação', icon: 'school' as const, color: Colors.education, background: Colors.educationLight, route: '/education' },
    { label: 'Saúde', icon: 'favorite' as const, color: Colors.health, background: Colors.healthLight, route: '/health' },
    { label: 'Finanças', icon: 'account-balance' as const, color: Colors.finance, background: Colors.financeLight, route: '/finance' },
  ];

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxxl }]}
    >
      {/* Header with gradient */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Image
          source={require('@/assets/images/hero_home.jpg')}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.headerOverlay} />

        {/* Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>V</Text>
            <Text style={styles.logoPlus}>+</Text>
          </View>
          <Text style={styles.logoWordmark}>Vitta<Text style={styles.logoWordmarkPlus}>+</Text></Text>
          <View style={{ flex: 1 }} />
          <Pressable
            style={({ pressed }) => [styles.notifButton, pressed && { opacity: 0.7 }]}
            hitSlop={8}
          >
            <MaterialIcons name="notifications-none" size={26} color={Colors.textOnPrimary} />
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingLabel}>{greeting()},</Text>
          <Text style={styles.greetingName}>{user.name} 👋</Text>
          <Text style={styles.greetingSubtitle}>Como você está se sentindo hoje?</Text>
        </View>

        {/* Support CTA */}
        <Pressable
          style={({ pressed }) => [styles.supportBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
          onPress={() => router.push('/(tabs)/messages')}
        >
          <View style={styles.supportIcon}>
            <MaterialIcons name="headset-mic" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.supportBtnTitle}>Falar com um atendente</Text>
            <Text style={styles.supportBtnSub}>Suporte humano disponível agora</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Modules */}
      <View style={styles.section}>
        <SectionHeader title="O que você precisa hoje?" />
        {modules.map((mod) => (
          <ModuleCard
            key={mod.label}
            label={mod.label}
            icon={mod.icon}
            color={mod.color}
            background={mod.background}
            onPress={() => router.push(mod.route as any)}
          />
        ))}
      </View>

      {/* Quick wellbeing check */}
      <View style={styles.section}>
        <SectionHeader
          title="Seu bem-estar"
          actionLabel="Ver histórico"
          onAction={() => router.push('/health')}
        />
        <View style={styles.wellbeingCard}>
          {todayLog ? (
            <View style={styles.wellbeingRow}>
              <Text style={styles.moodEmoji}>{moodEmoji[todayLog.mood]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.wellbeingTitle}>Hoje você se sentiu {todayLog.moodLabel.toLowerCase()}</Text>
                <Text style={styles.wellbeingNote} numberOfLines={2}>{todayLog.note}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.wellbeingRow}>
              <Text style={styles.moodEmoji}>📝</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.wellbeingTitle}>Você ainda não registrou hoje</Text>
                <Text style={styles.wellbeingNote}>Leva menos de 1 minuto anotar como está se sentindo.</Text>
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.wellbeingStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{avgMood > 0 ? avgMood.toFixed(1) : '—'}</Text>
              <Text style={styles.statLabel}>Humor médio</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Dias registrados</Text>
            </View>
            <View style={styles.statDivider} />
            <Pressable
              style={({ pressed }) => [styles.logButton, pressed && { opacity: 0.8 }]}
              onPress={() => router.push('/health')}
            >
              <MaterialIcons name="add" size={18} color={Colors.health} />
              <Text style={styles.logButtonText}>Registrar agora</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Upcoming agenda */}
      <View style={styles.section}>
        <SectionHeader
          title="Próximos compromissos"
          actionLabel="Ver agenda completa"
          onAction={() => router.push('/(tabs)/agenda')}
        />
        {upcomingItems.length > 0 ? (
          upcomingItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.agendaCard,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push('/(tabs)/agenda')}
            >
              <View style={[styles.agendaAccent, { backgroundColor: item.color }]} />
              <View style={[styles.agendaIconBox, { backgroundColor: item.color + '20' }]}>
                <MaterialIcons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.agendaTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.agendaMeta}>{item.dateLabel} · {item.time}</Text>
              </View>
              {item.confirmed ? (
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>Confirmado</Text>
                </View>
              ) : (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Aguardando</Text>
                </View>
              )}
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <MaterialIcons name="event-available" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum compromisso próximo</Text>
          </View>
        )}
      </View>

      {/* Tip of the day */}
      <View style={[styles.section, { marginBottom: 0 }]}>
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <MaterialIcons name="lightbulb" size={20} color={Colors.education} />
            <Text style={styles.tipLabel}>Dica do dia</Text>
          </View>
          <Text style={styles.tipText}>
            Beber de 6 a 8 copos de água por dia melhora a memória, a disposição e protege o coração. A sensação de sede diminui com a idade — beba mesmo sem sentir sede!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: {},

  // Header
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 44, 40, 0.72)',
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoMark: {
    width: 36,
    height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  logoText: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  logoPlus: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.travel,
    marginTop: -6,
  },
  logoWordmark: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  logoWordmarkPlus: {
    color: Colors.travel,
  },
  notifButton: {
    padding: 8,
  },

  // Greeting
  greetingBlock: { marginBottom: Spacing.lg },
  greetingLabel: {
    fontSize: FontSize.xl,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: FontWeight.regular,
  },
  greetingName: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
    lineHeight: 40,
  },
  greetingSubtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  // Support button
  supportBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  supportIcon: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportBtnTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  supportBtnSub: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
  },

  // Wellbeing card
  wellbeingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  wellbeingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  moodEmoji: {
    fontSize: 36,
    lineHeight: 44,
  },
  wellbeingTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  wellbeingNote: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  wellbeingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.health,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.healthLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  logButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.health,
  },

  // Agenda cards
  agendaCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  agendaAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  agendaIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  agendaTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  agendaMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  confirmedBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  confirmedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  pendingBadge: {
    backgroundColor: Colors.educationLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pendingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.education,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },

  // Tip card
  tipCard: {
    backgroundColor: Colors.educationLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.education,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.education,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tipText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
});
