import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

interface HealthResponse {
  status: 'ok' | 'error';
  service?: string;
  timestamp?: string;
}

const API_URL = 'http://localhost:3001';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data: HealthResponse) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setHealth({ status: 'error' });
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 DRARA Mobile</Text>
      <Text style={styles.subtitle}>AI Co-Founder & Idea Protection Platform</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>API Health Status</Text>
        {loading ? (
          <ActivityIndicator color="#a78bfa" />
        ) : (
          <View style={styles.statusRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: health?.status === 'ok' ? '#4ade80' : '#f87171' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: health?.status === 'ok' ? '#4ade80' : '#f87171' },
              ]}
            >
              {health?.status === 'ok' ? 'Online' : 'Offline'}
            </Text>
          </View>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a78bfa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e1e2e',
    borderColor: '#2d2d44',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
