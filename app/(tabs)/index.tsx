import produtosJson from '../data/produtos.json';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

type Produto = {
  id: string;
  nome: string;
  taxaJurosAnual: number;
  prazoMaximoMeses: number;
};

const fetchProdutos = (): Promise<Produto[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(produtosJson);
    }, 1500);
  });
};

export default function TabOneScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        // linha abaixo pela sua chamada de API real
        const dados = await fetchProdutos();
        setProdutos(dados);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []); 

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
           // Trocar para consulta de API 
          <Link
            href={{ pathname: "/produto/[id]", params: { id: item.id } }}
            asChild
          >
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardText}>Taxa: {item.taxaJurosAnual}% a.a.</Text>
              <Text style={styles.cardText}>Prazo máximo: {item.prazoMaximoMeses} meses</Text>
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F0F7',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
});