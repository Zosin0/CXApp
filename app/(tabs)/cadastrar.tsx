import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Cores do Design System
const CAIXA_BLUE = '#005CA9';
const CAIXA_ORANGE = '#F7A500';
const BACKGROUND_COLOR = '#F4F7FC';
const TEXT_COLOR = '#34495E';

const API_URL = 'http://192.168.0.2:5000';
// const API_URL = 'http://localhost:5000';

export default function CadastrarScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [taxa, setTaxa] = useState('');
  const [prazo, setPrazo] = useState('');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleCadastrar = async () => {
    if (!nome || !taxa || !prazo) {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          taxaJurosAnual: parseFloat(taxa),
          prazoMaximoMeses: parseInt(prazo),
        }),
      });

      if (!response.ok) throw new Error('Falha ao cadastrar o produto.');
      
      Alert.alert('Sucesso!', 'Produto cadastrado com sucesso.');
      router.push('/');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Dados do Novo Produto</Text>
        
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput
          style={[styles.input, focusedInput === 'nome' && styles.inputFocused]}
          placeholder="Ex: Empréstimo para reforma"
          value={nome}
          onChangeText={setNome}
          onFocus={() => setFocusedInput('nome')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={styles.label}>Taxa de Juros Anual (%)</Text>
        <TextInput
          style={[styles.input, focusedInput === 'taxa' && styles.inputFocused]}
          placeholder="Ex: 15.5"
          keyboardType="numeric"
          value={taxa}
          onChangeText={setTaxa}
          onFocus={() => setFocusedInput('taxa')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={styles.label}>Prazo Máximo (em meses)</Text>
        <TextInput
          style={[styles.input, focusedInput === 'prazo' && styles.inputFocused]}
          placeholder="Ex: 48"
          keyboardType="numeric"
          value={prazo}
          onChangeText={setPrazo}
          onFocus={() => setFocusedInput('prazo')}
          onBlur={() => setFocusedInput(null)}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar Produto</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CAIXA_BLUE,
    marginBottom: 24,
    textAlign: 'center',
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
    shadowColor: CAIXA_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: CAIXA_ORANGE,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
