// // ProductDetails.tsx
// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

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
//   reviews: { user: string; rating: number; comment: string }[];
// }

// const ProductDetails: React.FC<{ route: any }> = ({ route }) => {
//   const { product }: { product: Product } = route.params;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Image source={{ uri: product.image }} style={styles.image} />
//       <Text style={styles.name}>{product.name}</Text>
//       <Text style={styles.price}>${product.price}</Text>
//       <Text style={styles.category}>Category: {product.category}</Text>
//       <Text style={styles.description}>{product.description}</Text>

//       <View style={styles.section}>
//         <Text style={styles.sectionHeader}>Nutritional Information</Text>
//         <Text>Calories: {product.nutritionalInfo.calories} kcal</Text>
//         <Text>Fat: {product.nutritionalInfo.fat} g</Text>
//         <Text>Carbs: {product.nutritionalInfo.carbs} g</Text>
//         <Text>Protein: {product.nutritionalInfo.protein} g</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionHeader}>Reviews</Text>
//         {product.reviews.map((review, index) => (
//           <View key={index} style={styles.review}>
//             <Text style={styles.reviewUser}>{review.user}</Text>
//             <Text>Rating: {review.rating}/5</Text>
//             <Text>{review.comment}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#F8F8F8',
//     alignItems: 'center',
//   },
//   image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
//   name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
//   price: { fontSize: 20, color: '#1E90FF', marginBottom: 10 },
//   category: { fontSize: 16, color: '#555', marginBottom: 10 },
//   description: { fontSize: 16, textAlign: 'justify', marginBottom: 20 },
//   section: { width: '100%', marginBottom: 20 },
//   sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
//   review: { marginBottom: 10 },
//   reviewUser: { fontWeight: 'bold', fontSize: 16 },
// });

// export default ProductDetails;







//NOTE: this details dont show subarrays present in the API url because its generic code 

import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

interface Product {
  [key: string]: any; // Allow dynamic key-value pairs
}

const ProductDetails: React.FC<{ route: any }> = ({ route }) => {
  const { product }: { product: Product } = route.params;

  // Helper function to render non-array fields dynamically
  const renderField = (key: string, value: any) => {
    if (Array.isArray(value) || typeof value === 'object') return null; // Skip arrays and nested objects
    return (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldName}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Render Image */}
      {product.image && <Image source={{ uri: product.image }} style={styles.image} />}

      {/* Dynamically render simple fields (not arrays or nested objects) */}
      {Object.entries(product).map(([key, value]) => renderField(key, value))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#555',
  },
});

export default ProductDetails;
