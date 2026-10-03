// Vitta+ Agenda Screen — app/(tabs)/agenda.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAgenda, AgendaItem } from '@/contexts/AgendaContext';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const typeColors: Record<string, string> = {
  viagem: Colors.travel,
  curso: Colors.education,
  consulta: Colors.health,
  lembrete: Colors.primary,
};

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const { getUpcomingItems, removeItem, addItem } = useAgenda();
  const { showAlert } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const items = getUpcomingItems();

  const handleDelete = (item: AgendaItem) => {
    showAlert('Remover compromisso', `Deseja remover "${item.title}" da sua agenda?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => removeItem(item.id),
      },
    ]);
  };

  const handleAddReminder = () => {
    if (!newTitle.trim()) {
      showAlert('Campo obrigatório', 'Por favor, escreva um título para o lembrete.');
      return;
    }
    addItem({
      type: 'lembrete',
      typeLabel: 'Lembrete',
      title: newTitle.trim(),
      subtitle: newNote.trim() || 'Lembrete pessoal',
      date: newDate || '2025-07-10',
      dateLabel: newDate || '10 de Julho',
      time: newTime || '09:00',
      color: Colors.primary,
      icon: 'notifications',
      confirmed: true,
    });
    setNewTitle('');
    setNewNote('');
    setNewDate('');
    setNewTime('');
    setShowModal(false);
    showAlert('Lembrete adicionado!', 'Seu lembrete foi salvo na agenda.');
  };

  const groupedItems = items.reduce<Record<string, AgendaItem[]>>((acc, item) => {
    const key = item.dateLabel;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minha Agenda</Text>
          <Text style={styles.headerSubtitle}>{items.length} compromisso{items.length !== 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}
          onPress={() => setShowModal(true)}
        >
          <MaterialIcons name="add" size={22} color={Colors.textOnPrimary} />
          <Text style={styles.addButtonText}>Lembrete</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxxl }]}
      >
        {Object.entries(groupedItems).map(([dateLabel, group]) => (
          <View key={dateLabel} style={styles.dateGroup}>
            <View style={styles.dateLabelRow}>
              <View style={styles.dateLabelLine} />
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              <View style={styles.dateLabelLine} />
            </View>

            {group.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={[styles.itemAccent, { backgroundColor: item.color }]} />
                <View style={[styles.itemIconBox, { backgroundColor: item.color + '20' }]}>
                  <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                </View>
                <View style={styles.itemContent}>
                  <View style={styles.itemTopRow}>
                    <View style={[styles.typeBadge, { backgroundColor: item.color + '20' }]}>
                      <Text style={[styles.typeBadgeText, { color: item.color }]}>{item.typeLabel}</Text>
                    </View>
                    {item.confirmed ? (
                      <View style={styles.confirmedBadge}>
                        <MaterialIcons name="check-circle" size={12} color={Colors.success} />
                        <Text style={styles.confirmedText}>Confirmado</Text>
                      </View>
                    ) : (
                      <View style={styles.pendingBadge}>
                        <MaterialIcons name="schedule" size={12} color={Colors.education} />
                        <Text style={styles.pendingText}>Aguardando</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                  <View style={styles.itemTime}>
                    <MaterialIcons name="access-time" size={13} color={Colors.textMuted} />
                    <Text style={styles.itemTimeText}>{item.time}h · {item.dateLabel}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => handleDelete(item)}
                  hitSlop={10}
                  style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
                >
                  <MaterialIcons name="close" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </View>
        ))}

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-note" size={56} color={Colors.borderLight} />
            <Text style={styles.emptyTitle}>Agenda vazia</Text>
            <Text style={styles.emptyText}>
              Seus compromissos de viagens, cursos e consultas aparecerão aqui automaticamente.
              Você também pode adicionar lembretes pessoais.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Novo Lembrete</Text>

            <Text style={styles.inputLabel}>O que você quer lembrar?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Tomar remédio, ligar para médico..."
              placeholderTextColor={Colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={60}
            />

            <Text style={styles.inputLabel}>Observação (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Detalhes adicionais..."
              placeholderTextColor={Colors.textMuted}
              value={newNote}
              onChangeText={setNewNote}
              multiline
              numberOfLines={3}
              maxLength={120}
            />

            <View style={styles.dateTimeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 10 de Julho"
                  placeholderTextColor={Colors.textMuted}
                  value={newDate}
                  onChangeText={setNewDate}
                />
              </View>
              <View style={{ width: Spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 09:00"
                  placeholderTextColor={Colors.textMuted}
                  value={newTime}
                  onChangeText={setNewTime}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
                onPress={handleAddReminder}
              >
                <MaterialIcons name="check" size={18} color={Colors.textOnPrimary} />
                <Text style={styles.saveBtnText}>Salvar lembrete</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    ...Shadow.sm,
  },
  addButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  content: { paddingTop: Spacing.md, paddingHorizontal: Spacing.md },

  dateGroup: { marginBottom: Spacing.lg },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dateLabelLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dateLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  itemAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    flexShrink: 0,
  },
  itemContent: { flex: 1 },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  typeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  confirmedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.educationLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  pendingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.education,
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  itemTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTimeText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  deleteBtn: { padding: 4, flexShrink: 0 },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(44,40,38,0.5)',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateTimeRow: { flexDirection: 'row', marginTop: 4 },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    ...Shadow.sm,
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
