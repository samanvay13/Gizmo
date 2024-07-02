import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, StatusBar, FlatList, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthProvider';

const UsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { session } = useAuth();

  useEffect(() => {
    fetchUsers('');
  }, [session]);

  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${query}%`)
        .neq('id', session.user.id);

      if (error) {
        throw error;
      }

      setUsers(data);
    } catch (error) {
      Alert.alert('Error fetching users', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchUsers(query);
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <Text style={styles.username}>{item.username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4B0082', '#000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back-outline" size={25} color="#fff" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => fetchUsers(searchQuery)}>
              <Ionicons name="search-outline" size={24} color="#4B0082" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.placeholderText}>Loading...</Text>
        ) : searchQuery.trim() === '' ? (
          <View style={styles.search}>
            <Image source={require('../assets/avatars/search.png')} style={styles.searchImage}></Image>
            <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => fetchUsers(searchQuery)}>
              <Ionicons name="search-outline" size={24} color="#4B0082" />
            </TouchableOpacity>
            <Text style={styles.placeholderText}>
              Search the Pseudonym you're looking for.
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            ListEmptyComponent={
              <View style={styles.notFound}>
                <Image source={require('../assets/avatars/notFound.png')} style={styles.notFoundImage}></Image>
                <Text style={styles.placeholderText}>
                  Sorry, couldn't find the one you're looking for.
                </Text>
                <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => fetchUsers(searchQuery)}>
                  <Ionicons name="sad-outline" size={24} color="#4B0082" />
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    width: 350,
    marginLeft: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    color: '#4B0082',
  },
  search: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchImage: {
    marginTop: 100,
    height: 350,
    width: 350,
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundImage: {
    marginTop: 100,
    height: 350,
    width: 350,
  },
});

export default UsersScreen;
