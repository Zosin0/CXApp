import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

// Cores do Design System
const CAIXA_BLUE = '#005CA9';
const CAIXA_ORANGE = '#F7A500';
const BACKGROUND_COLOR = '#F4F7FC';
const TEXT_COLOR = '#34495E';
const WHITE = '#FFFFFF';

// Helper para formatar moeda
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function ResultadoSimulacaoModal() {
    const params = useLocalSearchParams();
    // Recebe o resultado como string JSON e o converte de volta para um objeto
    const resultado = params.resultado ? JSON.parse(params.resultado as string) : null;

    if (!resultado) {
        return (
            <View style={styles.centered}>
                <Text>Não foi possível carregar o resultado.</Text>
            </View>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Resultado da Simulação", headerStyle: {backgroundColor: CAIXA_BLUE}, headerTintColor: WHITE }} />
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.produtoNome}>{resultado.produtoNome}</Text>
            <View style={styles.cardsContainer}>
                <View style={[styles.card, {backgroundColor: CAIXA_BLUE}]}>
                    <Text style={styles.cardLabelWhite}>Valor da Parcela</Text>
                    <Text style={styles.cardValueWhite}>{formatCurrency(resultado.valorParcela)}</Text>
                </View>
                <View style={[styles.card, {backgroundColor: CAIXA_ORANGE}]}>
                    <Text style={styles.cardLabelWhite}>Valor Total</Text>
                    <Text style={styles.cardValueWhite}>{formatCurrency(resultado.valorTotalComJuros)}</Text>
                </View>
            </View>
            <Text style={styles.tableHeader}>Detalhes das Parcelas</Text>
          </>
        }
        data={resultado.memoriaCalculo}
        keyExtractor={(item) => item.mes.toString()}
        renderItem={({ item, index }) => (
            <View style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>{item.mes}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.juros)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.amortizacao)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.saldoDevedor)}</Text>
            </View>
        )}
        ListHeaderComponentStyle={{paddingHorizontal: 20}}
        ListFooterComponent={<View style={{height: 20}}/>} // Espaço no final
        stickyHeaderIndices={[2]} // Faz o header da tabela ficar fixo (requer ajustes mais complexos para funcionar perfeitamente com FlatList Header)
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    produtoNome: {
        fontSize: 18,
        color: TEXT_COLOR,
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: '500',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    card: {
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        width: '48%',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 3},
    },
    cardLabelWhite: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    cardValueWhite: {
        fontSize: 18,
        fontWeight: 'bold',
        color: WHITE,
        marginTop: 5,
    },
    tableHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: TEXT_COLOR,
        marginBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: WHITE,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingHorizontal: 20,
    },
    tableRowEven: {
        backgroundColor: BACKGROUND_COLOR,
    },
    tableCell: {
        flex: 1,
        textAlign: 'right',
        fontSize: 13,
        color: TEXT_COLOR,
    },
});
