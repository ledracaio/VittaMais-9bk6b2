// Vitta+ Finance Screen — app/finance.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAgenda } from '@/hooks/useAgenda';
import { useAlert } from '@/template';
import {
  simulateRetirement, formatCurrency, consultantTopics,
} from '@/services/financeService';
import { VittaButton } from '@/components/ui/VittaButton';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useAgenda();
  const { showAlert } = useAlert();

  const [currentAge, setCurrentAge] = useState('65');
  const [retirementAge, setRetirementAge] = useState('70');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [simulationResult, setSimulationResult] = useState<ReturnType<typeof simulateRetirement> | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSimulate = () => {
    const age = parseInt(currentAge) || 65;
    const retAge = parseInt(retirementAge) || 70;
    const savings = parseFloat(currentSavings.replace(/\D/g, '')) || 50000;
    const contrib = parseFloat(monthlyContribution.replace(/\D/g, '')) || 500;

    if (retAge <= age) {
      showAlert('Atenção', 'A idade de aposentadoria deve ser maior que a idade atual.');
      return;
    }

    const result = simulateRetirement({
      currentAge: age,
      retirementAge: retAge,
      currentSavings: savings,
      monthlyContribution: contrib,
      annualReturnRate: 8.5,
    });
    setSimulationResult(result);
  };

  const handleRequestConsultant = (topicId: string) => {
    const topic = consultantTopics.find((t) => t.id === topicId);
    if (!topic) return;
    addItem({
      type: 'consulta',
      typeLabel: 'Consultoria',
      title: `Consultoria: ${topic.title}`,
      subtitle: 'Roberto Figueiredo — Por videochamada',
      date: '2025-07-15',
      dateLabel: '15 de Julho',
      time: '14:00',
      color: Colors.finance,
      icon: 'account-balance',
      confirmed: false,
    });
    setSelectedTopic(null);
    showAlert(
      'Solicitação enviada!',
      `Nosso orientador Roberto Figueiredo entrará em contato para agendar sua consultoria sobre "${topic.title}".`
    );
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Intro */}
        <View style={styles.introBanner}>
          <MaterialIcons name="account-balance" size={22} color={Colors.finance} />
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>Planejamento para sua tranquilidade</Text>
            <Text style={styles.introText}>
              Simule sua renda na aposentadoria e fale com nosso orientador financeiro sem compromisso.
            </Text>
          </View>
        </View>

        {/* Simulator */}
        <View style={styles.simulatorCard}>
          <View style={styles.simulatorHeader}>
            <MaterialIcons name="calculate" size={20} color={Colors.finance} />
            <Text style={styles.simulatorTitle}>Simulador de Aposentadoria</Text>
          </View>

          <View style={styles.inputGrid}>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Sua idade atual</Text>
              <TextInput
                style={styles.input}
                value={currentAge}
                onChangeText={setCurrentAge}
                keyboardType="numeric"
                placeholder="65"
                placeholderTextColor={Colors.textMuted}
                maxLength={3}
              />
            </View>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Idade alvo</Text>
              <TextInput
                style={styles.input}
                value={retirementAge}
                onChangeText={setRetirementAge}
                keyboardType="numeric"
                placeholder="70"
                placeholderTextColor={Colors.textMuted}
                maxLength={3}
              />
            </View>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Reserva atual (R$)</Text>
              <TextInput
                style={styles.input}
                value={currentSavings}
                onChangeText={setCurrentSavings}
                keyboardType="numeric"
                placeholder="50.000"
                placeholderTextColor={Colors.textMuted}
                maxLength={10}
              />
            </View>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Aporte mensal (R$)</Text>
              <TextInput
                style={styles.input}
                value={monthlyContribution}
                onChangeText={setMonthlyContribution}
                keyboardType="numeric"
                placeholder="500"
                placeholderTextColor={Colors.textMuted}
                maxLength={8}
              />
            </View>
          </View>

          <Text style={styles.rateNote}>
            <MaterialIcons name="info-outline" size={12} color={Colors.textMuted} />
            {' '}Simulação com retorno anual de 8,5% ao ano (estimativa conservadora)
          </Text>

          <VittaButton
            label="Simular minha renda"
            onPress={handleSimulate}
            icon="trending-up"
            accentColor={Colors.finance}
            fullWidth
          />

          {simulationResult ? (
            <View style={styles.resultBox}>
              <View style={styles.resultDivider} />
              <Text style={styles.resultTitle}>Resultado da simulação</Text>

              <View style={styles.resultHighlight}>
                <Text style={styles.resultHighlightLabel}>Renda mensal estimada</Text>
                <Text style={styles.resultHighlightValue}>
                  {formatCurrency(simulationResult.estimatedMonthlyBenefit)}/mês
                </Text>
                <Text style={styles.resultHighlightSub}>em {simulationResult.yearsToRetirement} anos</Text>
              </View>

              <View style={styles.resultMetaRow}>
                <View style={styles.resultMetaItem}>
                  <Text style={styles.resultMetaLabel}>Patrimônio final</Text>
                  <Text style={styles.resultMetaValue}>
                    {formatCurrency(simulationResult.projection[simulationResult.projection.length - 1]?.balance ?? 0)}
                  </Text>
                </View>
                <View style={styles.resultMetaDivider} />
                <View style={styles.resultMetaItem}>
                  <Text style={styles.resultMetaLabel}>Retirada segura</Text>
                  <Text style={styles.resultMetaValue}>
                    {formatCurrency(simulationResult.recommendedSavings)}/mês
                  </Text>
                </View>
              </View>

              <View style={styles.resultInfo}>
                <MaterialIcons name="lightbulb" size={16} color={Colors.education} />
                <Text style={styles.resultInfoText}>
                  Esta é uma estimativa educativa. Para um plano personalizado, fale com nosso orientador.
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Consultant topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fale com um orientador</Text>
          <Text style={styles.sectionSubtitle}>
            Roberto Figueiredo, nosso especialista, pode te ajudar com:
          </Text>
          {consultantTopics.map((topic) => (
            <Pressable
              key={topic.id}
              style={({ pressed }) => [styles.topicCard, pressed && { opacity: 0.85 }]}
              onPress={() => setSelectedTopic(topic.id)}
            >
              <View style={styles.topicIconBox}>
                <MaterialIcons name={topic.icon as any} size={22} color={Colors.finance} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription} numberOfLines={2}>{topic.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        {/* Consultant CTA */}
        <Pressable
          style={({ pressed }) => [styles.consultCTA, pressed && { opacity: 0.9 }]}
          onPress={() => handleRequestConsultant('topic-1')}
        >
          <View style={styles.consultAvatar}>
            <MaterialIcons name="person" size={24} color={Colors.textOnPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.consultName}>Roberto Figueiredo</Text>
            <Text style={styles.consultRole}>Orientador Financeiro · Disponível</Text>
          </View>
          <View style={styles.consultBtn}>
            <Text style={styles.consultBtnText}>Agendar</Text>
          </View>
        </Pressable>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <MaterialIcons name="shield" size={14} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            O Vitta+ não é uma corretora de valores. Nossas orientações são educativas. Consulte sempre um profissional regulamentado antes de investir.
          </Text>
        </View>
      </ScrollView>

      {/* Topic confirmation */}
      {selectedTopic ? (
        <View style={styles.topicConfirmOverlay}>
          <View style={styles.topicConfirmSheet}>
            <View style={styles.modalHandle} />
            {(() => {
              const topic = consultantTopics.find((t) => t.id === selectedTopic);
              if (!topic) return null;
              return (
                <>
                  <View style={styles.topicConfirmIcon}>
                    <MaterialIcons name={topic.icon as any} size={32} color={Colors.finance} />
                  </View>
                  <Text style={styles.topicConfirmTitle}>{topic.title}</Text>
                  <Text style={styles.topicConfirmText}>{topic.description}</Text>
                  <Text style={styles.topicConfirmInfo}>
                    Roberto Figueiredo entrará em contato em até 24 horas para agendar sua conversa.
                  </Text>
                  <View style={styles.modalActions}>
                    <Pressable
                      style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => setSelectedTopic(null)}
                    >
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
                      onPress={() => handleRequestConsultant(selectedTopic)}
                    >
                      <Text style={styles.saveBtnText}>Confirmar solicitação</Text>
                    </Pressable>
                  </View>
                </>
              );
            })()}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxxl },

  introBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.financeLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderLeftWidth: 4, borderLeftColor: Colors.finance,
  },
  introTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  introText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },

  simulatorCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.lg, ...Shadow.md,
  },
  simulatorHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  simulatorTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  inputItem: { width: '47%' },
  inputLabel: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semibold,
    color: Colors.textSecondary, marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.background, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: FontSize.md,
    color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
  },
  rateNote: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.md, lineHeight: 18 },

  resultBox: { marginTop: Spacing.sm },
  resultDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  resultTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  resultHighlight: {
    backgroundColor: Colors.financeLight, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', marginBottom: Spacing.md,
  },
  resultHighlightLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  resultHighlightValue: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, color: Colors.finance },
  resultHighlightSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 4 },
  resultMetaRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around', marginBottom: Spacing.md,
  },
  resultMetaItem: { alignItems: 'center' },
  resultMetaLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  resultMetaValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  resultMetaDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  resultInfo: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.educationLight, borderRadius: Radius.md, padding: Spacing.sm,
  },
  resultInfoText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  sectionSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 20 },

  topicCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm,
  },
  topicIconBox: {
    width: 48, height: 48, borderRadius: Radius.md,
    backgroundColor: Colors.financeLight, alignItems: 'center', justifyContent: 'center',
  },
  topicTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  topicDescription: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginTop: 2 },

  consultCTA: {
    backgroundColor: Colors.finance, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, marginBottom: Spacing.lg, ...Shadow.md,
  },
  consultAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  consultName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  consultRole: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  consultBtn: {
    backgroundColor: Colors.textOnPrimary, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, borderRadius: Radius.full,
  },
  consultBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.finance },

  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  disclaimerText: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 18 },

  topicConfirmOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(44,40,38,0.5)', justifyContent: 'flex-end',
  },
  topicConfirmSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl, padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2,
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  topicConfirmIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.financeLight,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: Spacing.md,
  },
  topicConfirmTitle: {
    fontSize: FontSize.xxl, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm,
  },
  topicConfirmText: {
    fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginBottom: Spacing.md,
  },
  topicConfirmInfo: {
    fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center',
    lineHeight: 22, marginBottom: Spacing.lg,
    backgroundColor: Colors.financeLight, borderRadius: Radius.md, padding: Spacing.md,
  },
  modalActions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: Radius.full,
    borderWidth: 2, borderColor: Colors.border, alignItems: 'center',
  },
  cancelBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  saveBtn: {
    flex: 2, paddingVertical: 14, borderRadius: Radius.full,
    backgroundColor: Colors.finance, alignItems: 'center', ...Shadow.sm,
  },
  saveBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textOnPrimary },
});
