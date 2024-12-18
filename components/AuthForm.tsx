// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
// import { supabase } from '../supabase/client';

// interface AuthFormProps {
//   onAuthSuccess: () => void;
// }

// const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSignUp, setIsSignUp] = useState(false);

//   const handleAuth = async () => {
//     if (isSignUp) {
//       // Sign up the user and require email confirmation
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: { 
//           data: { username }, // Store username in metadata
//           emailRedirectTo: 'https://your-redirect-url.com' // Replace with your redirect URL
//         },
//       });

//       if (error) {
//         Alert.alert('Sign-Up Error', error.message);
//       } else {
//         if (data.user?.identities?.length === 0) {
//           Alert.alert('Sign-Up Error', 'Email already in use.');
//         } else {
//           // Add user to custom 'users' table
//           const { error: insertError } = await supabase
//             .from('users')
//             .insert([{ 
//               id: data.user?.id,
//               email,
//               username 
//             }]);

//           if (insertError) {
//             Alert.alert('Database Error', insertError.message);
//           } else {
//             Alert.alert('Success', 'Please check your email to confirm your account.');
//           }
//         }
//       }
//     } else {
//       // Log in the user
//       const { error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) {
//         Alert.alert('Login Error', error.message);
//       } else {
//         onAuthSuccess();
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {isSignUp && (
//         <TextInput
//           placeholder="Username"
//           style={styles.input}
//           value={username}
//           onChangeText={setUsername}
//         />
//       )}
//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title={isSignUp ? 'Sign Up' : 'Log In'} onPress={handleAuth} />
//       <Button
//         title={isSignUp ? 'Switch to Log In' : 'Switch to Sign Up'}
//         onPress={() => setIsSignUp(!isSignUp)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 16, justifyContent: 'center' },
//   input: { borderWidth: 1, marginBottom: 8, padding: 8, borderRadius: 4 },
// });

// export default AuthForm;












import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '../supabase/client';
import CustomButton from './/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [errors, setErrors] = useState({ email: '', password: '', username: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', username: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isSignUp && !username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { username },
          emailRedirectTo: 'https://your-redirect-url.com' // Replace with your redirect URL
        },
      });

      if (error) {
        Alert.alert('Sign-Up Error', error.message);
      } else {
        if (data.user?.identities?.length === 0) {
          Alert.alert('Sign-Up Error', 'Email already in use.');
        } else {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
              id: data.user?.id,
              email,
              username 
            }]);

          if (insertError) {
            Alert.alert('Database Error', insertError.message);
          } else {
            Alert.alert('Success', 'Please check your email to confirm your account.');
          }
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert('Login Error', error.message);
      } else {
        onAuthSuccess();
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
      {isSignUp && (
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#4A90E2" style={styles.icon} />
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>
      )}
      {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#4A90E2" style={styles.icon} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#4A90E2" style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      <CustomButton 
        title={isSignUp ? 'Sign Up' : 'Log In'} 
        onPress={handleAuth}
      />
      <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
          
        </Text>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        
        <Text style={styles.switchTextTwo}>
          {isSignUp ? 'Log In' : 'Sign Up'}
          
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  switchText: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 20,
  },
  switchTextTwo: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AuthForm;

