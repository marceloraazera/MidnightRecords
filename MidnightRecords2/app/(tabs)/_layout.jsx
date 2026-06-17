import { Tabs } from "expo-router";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import CartBadge from "../../components/CartBadge";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D4A74F",
        tabBarInactiveTintColor: "#CCF7E4",
        tabBarStyle: {
          height: 72,
          backgroundColor: "#15101F",
          borderTopWidth: 1,
          borderTopColor: "rgba(212, 167, 79, 0.25)",
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarActiveTintColor: "#D97B46",
          tabBarInactiveTintColor: "#300322",
          tabBarStyle: {
            height: 72,
            backgroundColor: "#FFF4C8",
            borderTopWidth: 1,
            borderTopColor: "rgba(217, 123, 70, 0.28)",
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Criar",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: "Carrinho",
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              <Feather name="shopping-cart" size={size} color={color} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
