import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const mockResultado = {
    dadosProduto: {
        nome: 'Crédito Pessoal Rápido',
    },
    taxaJurosMensal: 1.53,
    valorTotalComJuros: 6451.20,
    valorParcela: 537.60,
    memoriaCalculo: [
        { mes: 1, juros: 76.50, amortizacao: 461.10, saldoDevedor: 4538.90 },
        { mes: 2, juros: 69.45, amortizacao: 468.15, saldoDevedor: 4070.75 },
        { mes: 3, juros: 62.28, amortizacao: 475.32, saldoDevedor: 3595.43 },
        { mes: 12, juros: 8.10, amortizacao: 529.50, saldoDevedor: 0 },
    ]
};

export default function ResultadoSimulacaoModal() {
    const resultado = mockResultado;

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Resultado da Simulação</Text>
        <Text style={styles.produtoNome}>{resultado.dadosProduto.nome}</Text>

        <View style={styles.cardsContainer}>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Valor da Parcela</Text>
                <Text style={styles.cardValue}>R$ {resultado.valorParcela.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Total com Juros</Text>
                <Text style={styles.cardValue}>R$ {resultado.valorTotalComJuros.toFixed(2)}</Text>
            </View>
        </View>

        <Text style={styles.tableHeader}>Memória de Cálculo</Text>
        <View style={styles.table}>
            <View style={styles.tableRowHeader}>
                <Text style={styles.tableCellHeader}>Mês</Text>
                <Text style={styles.tableCellHeader}>Juros</Text>
                <Text style={styles.tableCellHeader}>Amortização</Text>
                <Text style={styles.tableCellHeader}>Saldo</Text>
            </View>
            <FlatList
                data={resultado.memoriaCalculo}
                keyExtractor={(item) => item.mes.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{item.mes}</Text>
                        <Text style={styles.tableCell}>R$ {item.juros.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>R$ {item.amortizacao.toFixed(2)}</Text>
                        <Text style={styles.tableCell}>R$ {item.saldoDevedor.toFixed(2)}</Text>
                    </View>
                )}
            />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#005CA9',
        textAlign: 'center',
        marginBottom: 10,
    },
    produtoNome: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#F0F0F7',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        width: '48%',
    },
    cardLabel: {
        fontSize: 14,
        color: '#666666',
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005CA9',
        marginTop: 5,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    table: {
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
    },
    tableRowHeader: {
        flexDirection: 'row',
        backgroundColor: '#EFEFF4',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tableCellHeader: {
        flex: 1,
        padding: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    }
});