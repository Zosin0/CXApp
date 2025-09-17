import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Produto = {
  id: string;
  nome: string;
  taxaJurosAnual: number;
  prazoMaximoMeses: number;
};

const fetchProdutoDetalhes = (id: string): Promise<Produto | null> => {
  console.log(`Buscando detalhes do produto ${id}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const produtoEncontrado = mockProdutos.find(p => p.id === id);
      resolve(produtoEncontrado || null);
      console.log('Detalhes recebidos!');
    }, 1000);
  });
};
const mockProdutos: Produto[] = [ // A mesma lista, para simular o "banco de dados"
  { id: '1', nome: 'Crédito Pessoal Rápido', taxaJurosAnual: 19.9, prazoMaximoMeses: 24 },
  { id: '2', nome: 'Financiamento de Veículo', taxaJurosAnual: 15.5, prazoMaximoMeses: 60 },
  { id: '3', nome: 'Capital de Giro MEI', taxaJurosAnual: 12.0, prazoMaximoMeses: 36 },
];


export default function SimulacaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const router = useRouter(); 

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  const [valor, setValor] = useState('');
  const [meses, setMeses] = useState('');

  useEffect(() => {
    if (id) {
      const carregarDetalhes = async () => {
        try {
          setLoading(true);
          const detalhes = await fetchProdutoDetalhes(id);
          setProduto(detalhes);
        } catch (error) {
          console.error("Erro ao buscar detalhes:", error);
          Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
        } finally {
          setLoading(false);
        }
      };
      carregarDetalhes();
    }
  }, [id]);

  const handleSimular = () => {
    // Validação simples dos campos
    if (!valor || !meses || !produto) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para simular.');
      return;
    }
    if (parseInt(meses) > produto.prazoMaximoMeses) {
      Alert.alert('Prazo Inválido', `O prazo não pode exceder ${produto.prazoMaximoMeses} meses para este produto.`);
      return;
    }

    console.log('Simulando com os dados:', { produtoId: id, valor, meses });
    router.push('/modal');
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  if (!produto) {
    return <View style={styles.centered}><Text>Produto não encontrado.</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>{produto.nome}</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Taxa de Juros: {produto.taxaJurosAnual}% a.a.</Text>
        <Text style={styles.infoText}>Prazo Máximo: {produto.prazoMaximoMeses} meses</Text>
      </View>
      
      <Text style={styles.label}>Valor do Empréstimo (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 5000"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Número de Meses</Text>
      <TextInput
        style={styles.input}
        placeholder={`Até ${produto.prazoMaximoMeses} meses`}
        keyboardType="numeric"
        value={meses}
        onChangeText={setMeses}
      />
      
      <Button title="Simular Empréstimo" onPress={handleSimular} />
    </ScrollView>
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
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#EFEFF4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
});