import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 


function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', 
        tabBarInactiveTintColor: 'gray',  
        tabBarStyle: {
          backgroundColor: '#F8F8F8',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produtos',
          headerTitle: 'Produtos Disponíveis', 
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cadastrar"
        options={{
          title: 'Cadastrar',
          headerTitle: 'Cadastrar Novo Produto',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
    </Tabs>
  );
}