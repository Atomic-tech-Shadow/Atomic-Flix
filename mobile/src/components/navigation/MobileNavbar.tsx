import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type MobileNavbarNavigationProp = StackNavigationProp<RootStackParamList>;

interface MobileNavbarProps {
  onSearch?: (query: string) => void;
  showSearchButton?: boolean;
  currentRoute?: string;
}

// Adaptation directe du navbar.tsx du site web
const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
  onSearch, 
  showSearchButton = true,
  currentRoute = 'Home'
}) => {
  const navigation = useNavigation<MobileNavbarNavigationProp>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items identiques au site web
  const navigationItems = [
    { name: 'Accueil', route: 'Home', icon: 'home' },
    { name: 'Animes', route: 'Home', icon: 'film' },
    { name: 'Mangas', route: 'Home', icon: 'book' },
  ];

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName as keyof RootStackParamList);
  };

  return (
    <>
      {/* Header principal (adaptation exacte du navbar.tsx) */}
      <View style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          height: 64,
        }}>
          {/* Logo (identique au site web) */}
          <TouchableOpacity
            onPress={() => handleNavigation('Home')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Logo ATOMIC FLIX avec gradient identique */}
              <LinearGradient
                colors={['#22d3ee', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>A</Text>
              </LinearGradient>
            </View>
            
            {/* Texte ATOMIC FLIX */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#f8fafc',
            }}>
              ATOMIC FLIX
            </Text>
          </TouchableOpacity>

          {/* Boutons mobile (identiques au site web) */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
            {/* Bouton recherche */}
            {showSearchButton && (
              <TouchableOpacity
                onPress={() => setIsSearchOpen(!isSearchOpen)}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: 'transparent',
                }}
              >
                <Icon 
                  name="search" 
                  size={20} 
                  color={isSearchOpen ? "#22d3ee" : "#94a3b8"} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Barre de recherche mobile (identique au site web) */}
        {isSearchOpen && (
          <View style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1e293b',
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 8,
              gap: 12,
            }}>
              <Icon name="search" size={20} color="#22d3ee" />
              <TextInput
                style={{
                  flex: 1,
                  color: '#f8fafc',
                  fontSize: 16,
                  borderWidth: 0,
                }}
                placeholder="Rechercher des animes..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                style={{ padding: 4 }}
              >
                <Icon name="close" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default MobileNavbar;