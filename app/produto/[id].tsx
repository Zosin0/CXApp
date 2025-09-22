import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Cores do Design System
const CAIXA_BLUE = '#005CA9';
const CAIXA_ORANGE = '#F7A500';
const BACKGROUND_COLOR = '#F4F7FC';
const TEXT_COLOR = '#34495E';

type Produto = {
  id: string;
  nome: string;
  taxaJurosAnual: number;
  prazoMaximoMeses: number;
};

// const API_URL = 'http://localhost:5000';
const API_URL = 'http://192.168.0.2:5000';

export default function SimulacaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [valorDesejado, setValorDesejado] = useState('');
  const [prazo, setPrazo] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutoDetalhes = async () => {
        // Encontra o produto na lista que já temos para evitar uma chamada extra.
        // Em um app real, talvez você fizesse uma chamada a /produtos/:id
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/produtos`);
            const produtos: Produto[] = await response.json();
            const encontrado = produtos.find(p => p.id === id);
            setProduto(encontrado || null);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
        } finally {
            setLoading(false);
        }
    };
    if (id) {
        fetchProdutoDetalhes();
    }
  }, [id]);

  const handleSimular = async () => {
    if (!valorDesejado || !prazo || !produto) {
      Alert.alert('Atenção', 'Preencha todos os campos para simular.');
      return;
    }
    if (parseInt(prazo) > produto.prazoMaximoMeses) {
      Alert.alert('Prazo Inválido', `O prazo não pode exceder ${produto.prazoMaximoMeses} meses.`);
      return;
    }

    try {
        const response = await fetch(`${API_URL}/simulacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                produtoId: id,
                valorDesejado: parseFloat(valorDesejado),
                prazo: parseInt(prazo),
            })
        });
        if(!response.ok) throw new Error("Erro na simulação");
        const resultado = await response.json();

        // Passa o resultado da simulação para a tela de modal via parâmetros da rota
        router.push({ pathname: '/modal', params: { resultado: JSON.stringify(resultado) } });

    } catch(error) {
        Alert.alert("Erro", "Não foi possível realizar a simulação.");
    }
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={CAIXA_BLUE} /></View>;
  }

  if (!produto) {
    return <View style={styles.centered}><Text>Produto não encontrado.</Text></View>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{produto.nome}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Taxa de Juros: {produto.taxaJurosAnual}% a.a.</Text>
          <Text style={styles.infoText}>Prazo Máximo: {produto.prazoMaximoMeses} meses</Text>
        </View>
        
        <Text style={styles.label}>Valor que você precisa (R$)</Text>
        <TextInput
          style={[styles.input, focusedInput === 'valor' && styles.inputFocused]}
          placeholder="Ex: 5000"
          keyboardType="numeric"
          value={valorDesejado}
          onChangeText={setValorDesejado}
          onFocus={() => setFocusedInput('valor')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={styles.label}>Em quantos meses quer pagar</Text>
        <TextInput
          style={[styles.input, focusedInput === 'prazo' && styles.inputFocused]}
          placeholder={`Até ${produto.prazoMaximoMeses} meses`}
          keyboardType="numeric"
          value={prazo}
          onChangeText={setPrazo}
          onFocus={() => setFocusedInput('prazo')}
          onBlur={() => setFocusedInput(null)}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSimular}>
          <Text style={styles.buttonText}>Simular Empréstimo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    contentContainer: {
        padding: 24,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: CAIXA_BLUE,
        marginBottom: 16,
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: '#E6F0FA',
        padding: 15,
        borderRadius: 8,
        marginBottom: 24,
        borderLeftWidth: 5,
        borderLeftColor: CAIXA_BLUE,
    },
    infoText: {
        fontSize: 16,
        color: TEXT_COLOR,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: TEXT_COLOR,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        height: 50,
        borderColor: '#D1D9E4',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    inputFocused: {
        borderColor: CAIXA_BLUE,
        borderWidth: 2,
    },
    button: {
        backgroundColor: CAIXA_ORANGE,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
