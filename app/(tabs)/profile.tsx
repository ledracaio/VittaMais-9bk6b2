// Vitta+ Profile Screen — app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

type FontSizeOption = 'normal' | 'grande' | 'extra-grande';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser, updatePreferences } = useUser();
  const { showAlert } = useAlert();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editCity, setEditCity] = useState(user.city);

  const fontSizeOptions: { value: FontSizeOption; label: string; description: string }[] = [
    { value: 'normal', label: 'Normal', description: 'Tamanho padrão' },
    { value: 'grande', label: 'Grande', description: '+15% maior' },
    { value: 'extra-grande', label: 'Extra Grande', description: '+30% maior' },
  ];

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showAlert('Campo obrigatório', 'Por favor, informe seu nome.');
      return;
    }
    updateUser({ name: editName.trim(), phone: editPhone.trim(), city: editCity.trim() });
    setShowEditModal(false);
    showAlert('Perfil atualizado!', 'Suas informações foram salvas com sucesso.');
  };

  const handleHelp = () => {
    showAlert(
      'Central de Ajuda',
      'Nossa equipe está disponível para te ajudar!\n\n📞 0800 123 4567\n✉️ atendimento@vittamais.com.br\n\nHorário: Seg–Sex, 8h às 20h\nSáb, 9h às 14h',
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileCity}>
              <MaterialIcons name="location-on" size={13} color={Colors.textMuted} /> {user.city}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              setEditName(user.name);
              setEditPhone(user.phone);
              setEditCity(user.city);
              setShowEditModal(true);
            }}
          >
            <MaterialIcons name="edit" size={18} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conforto visual</Text>
          <View style={styles.card}>
            <Text style={styles.optionTitle}>Tamanho do texto</Text>
            <Text style={styles.optionSubtitle}>Escolha o tamanho mais confortável para você</Text>
            <View style={styles.fontOptions}>
              {fontSizeOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.fontOption,
                    user.preferences.fontSize === opt.value && styles.fontOptionSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => updatePreferences({ fontSize: opt.value })}
                >
                  <Text
                    style={[
                      styles.fontOptionLabel,
                      user.preferences.fontSize === opt.value && styles.fontOptionLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.fontOptionDesc,
                      user.preferences.fontSize === opt.value && { color: Colors.primary },
                    ]}
                  >
                    {opt.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.card, styles.switchRow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>Tema escuro</Text>
              <Text style={styles.optionSubtitle}>Fundo escuro para reduzir cansaço visual</Text>
            </View>
            <Switch
              value={user.preferences.theme === 'escuro'}
              onValueChange={(val) => updatePreferences({ theme: val ? 'escuro' : 'claro' })}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.card}>
            <View style={[styles.switchRow, styles.switchRowItem]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Receber notificações</Text>
                <Text style={styles.optionSubtitle}>Lembretes e atualizações importantes</Text>
              </View>
              <Switch
                value={user.preferences.notifications}
                onValueChange={(val) => updatePreferences({ notifications: val })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>

            {user.preferences.notifications ? (
              <>
                <View style={styles.divider} />
                {[
                  { key: 'viagens' as const, label: 'Viagens', icon: 'flight' as const, color: Colors.travel },
                  { key: 'cursos' as const, label: 'Educação', icon: 'school' as const, color: Colors.education },
                  { key: 'saude' as const, label: 'Saúde', icon: 'favorite' as const, color: Colors.health },
                  { key: 'mensagens' as const, label: 'Mensagens', icon: 'chat' as const, color: Colors.primary },
                ].map((item) => (
                  <View key={item.key} style={[styles.switchRow, styles.switchRowItem]}>
                    <View style={[styles.notifIcon, { backgroundColor: item.color + '20' }]}>
                      <MaterialIcons name={item.icon} size={16} color={item.color} />
                    </View>
                    <Text style={[styles.optionTitle, { flex: 1 }]}>{item.label}</Text>
                    <Switch
                      value={user.preferences.notificationTypes[item.key]}
                      onValueChange={(val) =>
                        updatePreferences({
                          notificationTypes: { ...user.preferences.notificationTypes, [item.key]: val },
                        })
                      }
                      trackColor={{ false: Colors.border, true: item.color }}
                      thumbColor={Colors.surface}
                    />
                  </View>
                ))}
              </>
            ) : null}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte e informações</Text>
          <View style={styles.card}>
            {[
              { icon: 'headset-mic' as const, label: 'Central de atendimento', action: handleHelp },
              { icon: 'security' as const, label: 'Privacidade e dados', action: () => showAlert('Privacidade', 'Seus dados são protegidos conforme a LGPD. Não compartilhamos informações pessoais com terceiros sem seu consentimento.') },
              { icon: 'description' as const, label: 'Termos de uso', action: () => showAlert('Termos de Uso', 'Os termos completos estão disponíveis em vittamais.com.br/termos') },
              { icon: 'info' as const, label: 'Sobre o Vitta+', action: () => showAlert('Sobre o Vitta+', 'Versão 1.0.0\n\nVitta+ é a plataforma de confiança para brasileiros 60+ que valorizam qualidade de vida, aprendizado e uma presença humana ao seu lado.') },
            ].map((item, index, arr) => (
              <View key={item.label}>
                <Pressable
                  style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
                  onPress={item.action}
                >
                  <MaterialIcons name={item.icon} size={22} color={Colors.primary} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
                </Pressable>
                {index < arr.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Vitta+ · Versão 1.0.0</Text>
          <Text style={styles.versionSubtext}>Com carinho para quem merece o melhor</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Editar perfil</Text>

            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="(11) 9 0000-0000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={editCity}
              onChangeText={setEditCity}
              placeholder="Cidade, Estado"
              placeholderTextColor={Colors.textMuted}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveBtnText}>Salvar</Text>
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
  content: { paddingBottom: Spacing.xxxl },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileCity: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: { padding: Spacing.md, paddingBottom: 0 },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.md,
  },
  optionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  optionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },

  fontOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  fontOption: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  fontOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  fontOptionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fontOptionLabelSelected: { color: Colors.primary },
  fontOptionDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchRowItem: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 2,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  versionRow: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.semibold,
  },
  versionSubtext: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

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
    paddingVertical: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    ...Shadow.sm,
  },
  saveBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textOnPrimary,
  },
});
