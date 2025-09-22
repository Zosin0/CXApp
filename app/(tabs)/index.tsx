import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';

// Cores do Design System
const CAIXA_BLUE = '#005CA9';
const BACKGROUND_COLOR = '#F4F7FC';
const TEXT_COLOR = '#34495E';

type Produto = {
  id: string;
  nome: string;
  taxaJurosAnual: number;
  prazoMaximoMeses: number;
};

// ATENÇÃO: Troque 'localhost' pelo IP da sua máquina se for testar no celular físico
// const API_URL = 'http://localhost:5000';
const API_URL = 'http://192.168.0.2:5000';

export default function ListaProdutosScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/produtos`);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect recarrega os dados toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      fetchProdutos();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={CAIXA_BLUE} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/produto/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardIndicator} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardText}>Taxa de {item.taxaJurosAnual}% a.a.</Text>
                <Text style={styles.cardText}>Até {item.prazoMaximoMeses} meses</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: TEXT_COLOR,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIndicator: {
    width: 6,
    backgroundColor: CAIXA_BLUE,
  },
  cardContent: {
    padding: 20,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: CAIXA_BLUE,
  },
  cardText: {
    fontSize: 14,
    color: TEXT_COLOR,
    lineHeight: 20,
  },
});
