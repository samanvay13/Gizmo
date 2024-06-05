import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';

export default function TabsNavigator() {
    return (
        <Tabs>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: 'Gizmo',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" color={color} size={size} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: 'Gizmo',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                }} 
            />
        </Tabs>
    );
}
