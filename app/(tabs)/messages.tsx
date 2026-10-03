// Vitta+ Messages Screen — app/(tabs)/messages.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  supportAgents,
  quickQuestions,
  initialMessages,
  ChatMessage,
  getAutoResponse,
} from '@/services/messagesService';
import { Colors, Spacing, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAgents, setShowAgents] = useState(true);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'Você',
      text: text.trim(),
      timestamp: new Date(),
      isFromUser: true,
      read: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setShowAgents(false);

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}-r`,
        senderId: 'agent-3',
        senderName: 'Fernanda Costa',
        text: getAutoResponse(text),
        timestamp: new Date(),
        isFromUser: false,
        read: false,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1800);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerInfo}>
          <View style={styles.teamAvatars}>
            {supportAgents.slice(0, 2).map((agent, i) => (
              <Image
                key={agent.id}
                source={{ uri: agent.avatarUrl }}
                style={[styles.miniAvatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 2 - i }]}
                contentFit="cover"
                transition={200}
              />
            ))}
          </View>
          <View>
            <Text style={styles.headerTitle}>Equipe Vitta+</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>2 atendentes disponíveis</Text>
            </View>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.callBtn, pressed && { opacity: 0.8 }]}
          hitSlop={8}
        >
          <MaterialIcons name="phone" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Agent cards */}
      {showAgents ? (
        <View style={styles.agentsSection}>
          <Text style={styles.agentsSectionTitle}>Sua equipe de apoio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agentsScroll}>
            {supportAgents.map((agent) => (
              <Pressable
                key={agent.id}
                style={({ pressed }) => [styles.agentCard, pressed && { opacity: 0.85 }]}
                onPress={() => sendMessage(`Olá, ${agent.name}! Preciso de ajuda com ${agent.specialty.toLowerCase()}.`)}
              >
                <Image
                  source={{ uri: agent.avatarUrl }}
                  style={styles.agentAvatar}
                  contentFit="cover"
                  transition={200}
                />
                {agent.isOnline ? <View style={styles.agentOnlineDot} /> : null}
                <Text style={styles.agentName}>{agent.name.split(' ')[0]}</Text>
                <Text style={styles.agentRole} numberOfLines={2}>{agent.role}</Text>
                <View style={[styles.agentStatus, { backgroundColor: agent.isOnline ? Colors.successLight : Colors.surfaceMuted }]}>
                  <Text style={[styles.agentStatusText, { color: agent.isOnline ? Colors.success : Colors.textMuted }]}>
                    {agent.isOnline ? 'Disponível' : 'Ausente'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Quick questions */}
      {messages.length <= 1 ? (
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Perguntas frequentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickQuestions.map((q) => (
              <Pressable
                key={q.id}
                style={({ pressed }) => [styles.quickChip, pressed && { opacity: 0.75 }]}
                onPress={() => sendMessage(q.text)}
              >
                <Text style={styles.quickChipText}>{q.text}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubbleContainer,
              msg.isFromUser && styles.messageBubbleContainerUser,
            ]}
          >
            {!msg.isFromUser ? (
              <View style={styles.agentInitials}>
                <Text style={styles.agentInitialsText}>
                  {msg.senderName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
            ) : null}
            <View style={[styles.messageBubble, msg.isFromUser && styles.messageBubbleUser]}>
              {!msg.isFromUser ? (
                <Text style={styles.bubbleSenderName}>{msg.senderName}</Text>
              ) : null}
              <Text style={[styles.bubbleText, msg.isFromUser && styles.bubbleTextUser]}>
                {msg.text}
              </Text>
              <Text style={[styles.bubbleTime, msg.isFromUser && styles.bubbleTimeUser]}>
                {formatTime(msg.timestamp)}
                {msg.isFromUser ? <MaterialIcons name="done-all" size={12} color="rgba(255,255,255,0.7)" /> : null}
              </Text>
            </View>
          </View>
        ))}
        {isTyping ? (
          <View style={styles.messageBubbleContainer}>
            <View style={styles.agentInitials}>
              <Text style={styles.agentInitialsText}>FC</Text>
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.typingText}>Fernanda está digitando...</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <TextInput
          style={styles.textInput}
          placeholder="Escreva sua mensagem..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(inputText)}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <MaterialIcons name="send" size={20} color={Colors.textOnPrimary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  teamAvatars: { flexDirection: 'row' },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  agentsSection: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  agentsSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  agentsScroll: { paddingLeft: Spacing.md },
  agentCard: {
    width: 110,
    marginRight: Spacing.sm,
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  agentAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: Spacing.sm },
  agentOnlineDot: {
    position: 'absolute',
    top: Spacing.sm + 38,
    right: Spacing.md + 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  agentName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  agentRole: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 16,
  },
  agentStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  agentStatusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  quickSection: {
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.md,
    backgroundColor: Colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  quickTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 220,
  },
  quickChipText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },

  messageList: { flex: 1 },
  messageListContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  messageBubbleContainerUser: { flexDirection: 'row-reverse' },
  agentInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  agentInitialsText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.xs ?? 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  messageBubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.xs ?? 4,
  },
  bubbleSenderName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bubbleTextUser: { color: Colors.textOnPrimary },
  bubbleTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.65)' },
  typingText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
    flexShrink: 0,
  },
  sendButtonDisabled: { backgroundColor: Colors.border },
});
