// Vitta+ Health Screen — app/health.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHealth } from '@/hooks/useHealth';
import { useAgenda } from '@/hooks/useAgenda';
import { useAlert } from '@/template';
import { MoodLevel, moodLabels, moodEmoji, getHealthTips } from '@/services/healthService';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const MOODS: MoodLevel[] = [1, 2, 3, 4, 5];

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const { logs, addLog, getTodayLog, getAverageMood } = useHealth();
  const { addItem } = useAgenda();
  const { showAlert } = useAlert();

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(4);
  const [selectedEnergy, setSelectedEnergy] = useState<MoodLevel>(4);
  const [noteText, setNoteText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const todayLog = getTodayLog();
  const avgMood = getAverageMood();
  const tips = getHealthTips();

  const symptomOptions = [
    'Cansaço', 'Dor de cabeça', 'Dor nas costas', 'Dor no joelho',
    'Insônia', 'Náusea', 'Tontura', 'Falta de apetite',
  ];

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSaveLog = () => {
    const today = new Date().toISOString().split('T')[0];
    addLog({
      date: today,
      dateLabel: 'Hoje',
      mood: selectedMood,
      moodLabel: moodLabels[selectedMood],
      energyLevel: selectedEnergy,
      note: noteText.trim(),
      symptoms: selectedSymptoms,
    });
    setShowLogModal(false);
    setNoteText('');
    setSelectedSymptoms([]);
    showAlert('Registro salvo!', 'Como você está se sentindo foi anotado. Continue registrando para acompanhar seu bem-estar ao longo do tempo.');
  };

  const handleRequestConsult = () => {
    addItem({
      type: 'consulta',
      typeLabel: 'Teleconsulta',
      title: 'Teleconsulta Vitta+',
      subtitle: 'Profissional de saúde — Por videochamada',
      date: '2025-07-12',
      dateLabel: '12 de Julho',
      time: '10:00',
      color: Colors.health,
      icon: 'video-call',
      confirmed: false,
    });
    showAlert(
      'Solicitação enviada!',
      'Nossa equipe entrará em contato para confirmar o horário da sua teleconsulta. Verifique sua agenda e mensagens.'
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Today check-in */}
        <View style={styles.checkInCard}>
          <View style={styles.checkInHeader}>
            <MaterialIcons name="favorite" size={22} color={Colors.health} />
            <Text style={styles.checkInTitle}>Como você está hoje?</Text>
          </View>
          {todayLog ? (
            <View style={styles.todayLogged}>
              <Text style={styles.todayEmoji}>{moodEmoji[todayLog.mood]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.todayMood}>Você registrou: {todayLog.moodLabel}</Text>
                {todayLog.note ? (
                  <Text style={styles.todayNote} numberOfLines={2}>{todayLog.note}</Text>
                ) : null}
              </View>
              <Pressable
                style={({ pressed }) => [styles.relogBtn, pressed && { opacity: 0.75 }]}
                onPress={() => setShowLogModal(true)}
              >
                <Text style={styles.relogBtnText}>Atualizar</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.checkInSubtitle}>
                Registre como está se sentindo. Leva menos de 1 minuto e ajuda a acompanhar sua saúde ao longo do tempo.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.logButton, pressed && { opacity: 0.85 }]}
                onPress={() => setShowLogModal(true)}
              >
                <MaterialIcons name="add" size={18} color={Colors.textOnPrimary} />
                <Text style={styles.logButtonText}>Registrar agora</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{avgMood > 0 ? avgMood.toFixed(1) : '—'}</Text>
            <Text style={styles.statLabel}>Humor médio{'\n'}últimos 7 dias</Text>
            <MaterialIcons name="trending-up" size={20} color={Colors.health} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{logs.length}</Text>
            <Text style={styles.statLabel}>Dias{'\n'}registrados</Text>
            <MaterialIcons name="event-note" size={20} color={Colors.health} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{moodEmoji[Math.round(avgMood) as MoodLevel ?? 4]}</Text>
            <Text style={styles.statLabel}>Tendência{'\n'}geral</Text>
            <MaterialIcons name="favorite" size={20} color={Colors.health} />
          </View>
        </View>

        {/* Teleconsulta CTA */}
        <Pressable
          style={({ pressed }) => [styles.consultCard, pressed && { opacity: 0.9 }]}
          onPress={handleRequestConsult}
        >
          <View style={styles.consultIcon}>
            <MaterialIcons name="video-call" size={26} color={Colors.textOnPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.consultTitle}>Teleconsulta com profissional</Text>
            <Text style={styles.consultSub}>Converse com um médico ou enfermeiro por videochamada</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={Colors.textOnPrimary} />
        </Pressable>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico recente</Text>
          {logs.slice(0, 7).map((log) => (
            <View key={log.id} style={styles.logCard}>
              <Text style={styles.logEmoji}>{moodEmoji[log.mood]}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.logTopRow}>
                  <Text style={styles.logDateLabel}>{log.dateLabel}</Text>
                  <View style={[styles.moodBadge, { backgroundColor: Colors.healthLight }]}>
                    <Text style={[styles.moodBadgeText, { color: Colors.health }]}>{log.moodLabel}</Text>
                  </View>
                </View>
                {log.note ? (
                  <Text style={styles.logNote} numberOfLines={2}>{log.note}</Text>
                ) : null}
                {log.symptoms.length > 0 ? (
                  <View style={styles.symptomsRow}>
                    {log.symptoms.map((s) => (
                      <View key={s} style={styles.symptomChip}>
                        <Text style={styles.symptomChipText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas de bem-estar</Text>
          {tips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={[styles.tipIcon, { backgroundColor: Colors.healthLight }]}>
                <MaterialIcons name={tip.icon as any} size={20} color={Colors.health} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipText}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Log Modal */}
      <Modal visible={showLogModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + Spacing.md }]}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Como você está hoje?</Text>

              <Text style={styles.inputLabel}>Humor geral</Text>
              <View style={styles.moodRow}>
                {MOODS.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setSelectedMood(m)}
                    style={[styles.moodOption, selectedMood === m && styles.moodOptionSelected]}
                  >
                    <Text style={styles.moodOptionEmoji}>{moodEmoji[m]}</Text>
                    <Text style={[styles.moodOptionLabel, selectedMood === m && { color: Colors.health, fontWeight: FontWeight.bold }]}>
                      {moodLabels[m]}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Nível de energia</Text>
              <View style={styles.energyRow}>
                {MOODS.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setSelectedEnergy(m)}
                    style={[styles.energyOption, selectedEnergy === m && styles.energyOptionSelected]}
                  >
                    <Text style={[styles.energyLabel, selectedEnergy === m && { color: Colors.textOnPrimary }]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.energyLabels}>
                <Text style={styles.energyLabelText}>Sem energia</Text>
                <Text style={styles.energyLabelText}>Muita energia</Text>
              </View>

              <Text style={styles.inputLabel}>Sintomas (opcional)</Text>
              <View style={styles.symptomsGrid}>
                {symptomOptions.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => toggleSymptom(s)}
                    style={[styles.symptomOption, selectedSymptoms.includes(s) && styles.symptomOptionSelected]}
                  >
                    <Text style={[styles.symptomOptionText, selectedSymptoms.includes(s) && styles.symptomOptionTextSelected]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Anotação (opcional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Como foi seu dia? Algo que queira lembrar..."
                placeholderTextColor={Colors.textMuted}
                value={noteText}
                onChangeText={setNoteText}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                onPress={() => setShowLogModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
                onPress={handleSaveLog}
              >
                <MaterialIcons name="check" size={18} color={Colors.textOnPrimary} />
                <Text style={styles.saveBtnText}>Salvar registro</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxxl },

  checkInCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.health,
    ...Shadow.sm,
  },
  checkInHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  checkInTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  checkInSubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  logButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.health, borderRadius: Radius.full,
    paddingVertical: 14, ...Shadow.sm,
  },
  logButtonText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textOnPrimary },
  todayLogged: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  todayEmoji: { fontSize: 36 },
  todayMood: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  todayNote: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginTop: 2 },
  relogBtn: {
    backgroundColor: Colors.healthLight, paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm, borderRadius: Radius.full,
  },
  relogBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.health },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4, ...Shadow.sm,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.health },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center', lineHeight: 16 },

  consultCard: {
    backgroundColor: Colors.health, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.lg, ...Shadow.md,
  },
  consultIcon: {
    width: 48, height: 48, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  consultTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  consultSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.xl, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },

  logCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm,
  },
  logEmoji: { fontSize: 28, lineHeight: 34 },
  logTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  logDateLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  moodBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  moodBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  logNote: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  symptomsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  symptomChip: {
    backgroundColor: Colors.errorLight, paddingHorizontal: Spacing.sm,
    paddingVertical: 2, borderRadius: Radius.full,
  },
  symptomChipText: { fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium },

  tipCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm,
  },
  tipIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  tipText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(44,40,38,0.5)' },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '90%',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2,
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  modalTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  inputLabel: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.sm,
  },
  moodRow: { flexDirection: 'row', gap: Spacing.xs },
  moodOption: {
    flex: 1, alignItems: 'center', padding: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  moodOptionSelected: { borderColor: Colors.health, backgroundColor: Colors.healthLight },
  moodOptionEmoji: { fontSize: 24, marginBottom: 4 },
  moodOptionLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  energyRow: { flexDirection: 'row', gap: Spacing.sm },
  energyOption: {
    flex: 1, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  energyOptionSelected: { backgroundColor: Colors.health, borderColor: Colors.health },
  energyLabel: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  energyLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: Spacing.sm },
  energyLabelText: { fontSize: FontSize.xs, color: Colors.textMuted },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  symptomOption: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  symptomOptionSelected: { backgroundColor: Colors.healthLight, borderColor: Colors.health },
  symptomOptionText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  symptomOptionTextSelected: { color: Colors.health, fontWeight: FontWeight.bold },
  input: {
    backgroundColor: Colors.background, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.md,
    color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: Radius.full,
    borderWidth: 2, borderColor: Colors.border, alignItems: 'center',
  },
  cancelBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  saveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, paddingVertical: 14, borderRadius: Radius.full,
    backgroundColor: Colors.health, ...Shadow.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textOnPrimary },
});
