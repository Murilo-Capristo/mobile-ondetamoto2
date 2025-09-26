import { View, Text, TouchableOpacity } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';
const roxo_texto = '#a100ff';

export default function CadastroMoto() {
  const navigation = useNavigation();

  const [moto, setMoto] = useState({
    tagId: '',
  });
  const [detectedMotos, setDetectedMotos] = useState<{ tagId: string }[]>([]);

  const [isDetecting, setIsDetecting] = useState(false);
  const [isPageExited, setIsPageExited] = useState(false);

  const saveMoto = async (motoData) => {
    try {
      await AsyncStorage.setItem('motoData', JSON.stringify(motoData));
      console.log('Salvo');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const getMoto = async () => {
    try {
      const storedMoto = await AsyncStorage.getItem('motoData');
      if (storedMoto) {
        const parsedMoto = JSON.parse(storedMoto);
        setMoto(parsedMoto);
        console.log('Moto recuperada:', parsedMoto);
      }
    } catch (error) {
      console.error('Erro ao obter:', error);
    }
  };

  useEffect(() => {
    const fetchStoredMotos = async () => {
      try {
        const storedMotos = await AsyncStorage.getItem('detectedMotos');
        if (storedMotos) {
          setDetectedMotos(JSON.parse(storedMotos));
          console.log(
            'Motos recuperadas do armazenamento:',
            JSON.parse(storedMotos),
          );
        }
      } catch (error) {
        console.error('Erro ao recuperar motos do armazenamento:', error);
      }
    };

    fetchStoredMotos();
    getMoto();

    return () => {
      setIsPageExited(true);
    };
  }, []);

  const handleMoto = async () => {
    setIsDetecting(true);

    try {
      const storedMotos = await AsyncStorage.getItem('detectedMotos');
      if (storedMotos) {
        setTimeout(() => {
          setDetectedMotos(JSON.parse(storedMotos));
          console.log(
            'Motos recuperadas do armazenamento:',
            JSON.parse(storedMotos),
          );
          setIsDetecting(false);
        }, 1000);
      } else {
        setTimeout(async () => {
          const motosDetectadas = Array.from({ length: 3 }, () => ({
            tagId: Math.floor(1000 + Math.random() * 9000).toString(),
          }));
          setDetectedMotos(motosDetectadas);
          await AsyncStorage.setItem(
            'detectedMotos',
            JSON.stringify(motosDetectadas),
          );
          console.log('Motos detectadas e salvas:', motosDetectadas);
          setIsDetecting(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao detectar motos:', error);
      setIsDetecting(false);
    }
  };

  return (
    <View>
      <HeaderReduzida />
      <View style={styles.title}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <Icon name="arrow-back" size={28} color={roxo_escuro} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Cadastro de Moto</Text>
      </View>

      <TouchableOpacity
        style={styles.detectarMoto}
        onPress={handleMoto}
        disabled={isDetecting || isPageExited}
      >
        <Icon name="wifi-tethering" style={styles.icon}></Icon>
        <Text style={styles.detecText}>Detectar Motocicleta</Text>
      </TouchableOpacity>

      {isDetecting ? (
        <View style={styles.boxBuscando}>
          <View style={styles.buscando}>
            <Text style={styles.titlebuscando}>Buscando...</Text>
          </View>
        </View>
      ) : (
        detectedMotos.length > 0 && (
          <View
            style={[styles.boxBuscando, { height: detectedMotos.length * 100 }]}
          >
            <View style={styles.buscando}>
              <Text style={styles.titlebuscando}>Motos Detectadas:</Text>
              {detectedMotos.map((moto, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.motos}
                  onPress={() =>
                    (navigation as any).navigate('FormMoto', {
                      tagId: moto.tagId,
                    })
                  }
                >
                  <Text style={styles.textMotos}>{`Tag - ${moto.tagId}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  motos: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    width: '100%',
  },

  textMotos: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
  },
  boxBuscando: {
    marginTop: 50,
    marginHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 10,
    backgroundColor: '#DCDEDF',
    borderRadius: 20,
  },

  titlebuscando: {
    fontSize: 18,
    fontWeight: 'semibold',
    color: '#8b8b8b',
  },
  buscando: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },

  detecText: {
    fontSize: 29,
    fontWeight: 'semibold',
    color: '#000',
  },
  detectarMoto: {
    marginTop: 50,
    margin: 40,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDEDF',
    borderRadius: 20,
    borderColor: '#009213',
    borderWidth: 4,
  },
  title: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 3,
    color: '#009213',
    fontSize: 35,
  },
});
