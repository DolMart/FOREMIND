// src/app/(tabs)/index.tsx
import { BottomTabInset, Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import { BrainCircuit, Plus, ShoppingCart } from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── mock data — reemplaza con tu estado real ──────────────────
const MOCK_LISTS = [
  // array vacío para ver el empty state
  // { id: '1', name: 'Supermercado', items: 8, done: 3 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const userName = 'Dolimer'; // TODO: reemplaza con tu auth user

  const isEmpty = MOCK_LISTS.length === 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.six,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {userName} 👋</Text>
            <Text style={styles.subtitle}>
              {isEmpty
                ? 'Aún no tienes listas creadas'
                : `Tienes ${MOCK_LISTS.length} lista${MOCK_LISTS.length > 1 ? 's' : ''}`}
            </Text>
          </View>
          <View style={styles.iconBadge}>
            <BrainCircuit size={22} color='#34d399' strokeWidth={1.5} />
          </View>
        </View>

        {/* ── Empty state ── */}
        {isEmpty && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <ShoppingCart size={48} color='#34d399' strokeWidth={1.2} />
            </View>
            <Text style={styles.emptyTitle}>Tu primera lista te espera</Text>
            <Text style={styles.emptyBody}>
              Crea una lista de compras, agrégale productos y compártela con
              quien quieras.
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={() => router.push('/create-list')} // TODO: ruta real
            >
              <Plus size={18} color='#020617' strokeWidth={2.5} />
              <Text style={styles.ctaText}>Crear mi primera lista</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Lists ── */}
        {!isEmpty && (
          <View style={styles.listsSection}>
            <Text style={styles.sectionTitle}>MIS LISTAS</Text>
            {MOCK_LISTS.map((list: any) => (
              <TouchableOpacity
                key={list.id}
                style={styles.listCard}
                activeOpacity={0.75}
              >
                <View style={styles.listCardLeft}>
                  <View style={styles.listIconContainer}>
                    <ShoppingCart size={20} color='#34d399' strokeWidth={1.5} />
                  </View>
                  <View>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listMeta}>
                      {list.done}/{list.items} items completados
                    </Text>
                  </View>
                </View>
                <View style={styles.progressPill}>
                  <Text style={styles.progressText}>
                    {Math.round((list.done / list.items) * 100)}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── FAB — solo visible cuando hay listas ── */}
      {!isEmpty && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + BottomTabInset + 16 }]}
          activeOpacity={0.85}
          onPress={() => router.push('/create-list')}
        >
          <Plus size={24} color='#020617' strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  // ── header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    letterSpacing: 0.2,
  },
  iconBadge: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
  },

  // ── empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    gap: 16,
  },
  emptyIconContainer: {
    padding: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e2e8f0',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  emptyBody: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#020617',
    letterSpacing: 0.3,
  },

  // ── lists ──
  listsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIconContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  listMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  progressPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34d399',
  },

  // ── FAB ──
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});
