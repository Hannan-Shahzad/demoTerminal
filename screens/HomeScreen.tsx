import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { supabase } from '../supabase/client';

// interface Product {
//   id: string;
//   name: string;
//   price: string;
//   image: string;
//   category: string;
//   description: string;
//   nutritionalInfo: {
//     calories: number;
//     fat: number;
//     carbs: number;
//     protein: number;
//   };
// }

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // const [data, setData] = useState<Product[]>([]);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch data from Supabase
  const fetchFromSupabase = async () => {
    const { data: supabaseData, error } = await supabase
      .from('products')
      .select('data')
      .order('created_at', { ascending: false })
      .limit(1); // Fetch the latest entry (if it exists)

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return null;
    }

    console.log('Data fetched from Supabase:', supabaseData);
    return supabaseData?.[0]?.data;
  };

  // Function to fetch data from the API
  const fetchFromAPI = async () => {
    try {
      const response = await fetch('https://ayaan-ahmad24.github.io/data/data.json');
      // const result: Product[] = await response.json();
      const result: any = await response.json();
      console.log('Data fetched from API:', result);
      setData(result);
      
      // Save the data to Supabase
      const { error } = await supabase
        .from('products')
        .insert([
          { data: result },
        ]);

      if (error) {
        console.error('Error storing data in Supabase:', error);
      } else {
        console.log('Data successfully stored in Supabase');
      }
    } catch (error) {
      console.error('Error fetching from API:', error);
    }
  };

  // Fetch data from Supabase or API
  const fetchData = async () => {
    console.log('Fetching data...');
    const supabaseData = await fetchFromSupabase();

    if (supabaseData) {
      console.log('Using data from Supabase...');
      // Use data from Supabase
      setData(supabaseData);
    } else {
      console.log('No data in Supabase, fetching from API...');
      // If no data in Supabase, fetch from API
      fetchFromAPI();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  // const renderItem = ({ item }: { item: Product }) => (

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu Items</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', paddingTop: 10 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#1E90FF', marginTop: 5 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
