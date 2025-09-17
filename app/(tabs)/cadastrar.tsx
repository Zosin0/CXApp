import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastrarScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [taxa, setTaxa] = useState('');
  const [prazo, setPrazo] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !taxa || !prazo) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    const dadosProduto = {
      nome,
      taxaJurosAnual: parseFloat(taxa),
      prazoMaximoMeses: parseInt(prazo),
    };

    console.log('Enviando para a API:', dadosProduto);
    
    // try {
    //   const response = await fetch('URL_DA_SUA_API/produtos', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(dadosProduto),
    //   });
    //
    //   if (!response.ok) throw new Error('Falha ao cadastrar');
    //
    //   Alert.alert('Sucesso!', 'Produto cadastrado com sucesso.');
    //   router.push('/'); // Volta para a lista de produtos
    // } catch (error) {
    //   Alert.alert('Erro no Cadastro', 'Não foi possível cadastrar o produto.');
    // }

    Alert.alert('Sucesso!', 'Produto cadastrado com sucesso (simulação).');
    router.push('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Novo Produto de Empréstimo</Text>
      
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Empréstimo para reforma"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Taxa de Juros Anual (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 15.5"
        keyboardType="numeric"
        value={taxa}
        onChangeText={setTaxa}
      />

      <Text style={styles.label}>Prazo Máximo (em meses)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 48"
        keyboardType="numeric"
        value={prazo}
        onChangeText={setPrazo}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar Produto" onPress={handleCadastrar} color="#FF7A00" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: '#005CA9',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
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
  buttonContainer: {
      marginTop: 10,
      borderRadius: 8,
      overflow: 'hidden',
  }
});