import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [ufsDropdown, setUfsDropdown] = useState<
    { label: string; value: string }[]
  >([{ label: "Selecione uma UF", value: "0" }]);
  const [citiesDropdown, setCitiesDropdown] = useState<
    { label: string; value: string }[]
  >([{ label: "Selecione uma Cidade", value: "0" }]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate("Points", { city: selectedCity, uf: selectedUf });
  }

  function compare(a: string, b: string) {
    const A = a.toUpperCase();
    const B = b.toUpperCase();

    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return comparison;
  }

  useEffect(() => {
    async function fetchData() {
      await axios
        .get<IBGEUFResponse[]>(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        )
        .then((response) => {
          const ufInitials = response.data.map((uf) => uf.sigla);
          ufInitials.sort(compare);
          const ufsDropdownArray = ufInitials.map((uf) => ({
            label: uf,
            value: uf,
          }));

          setUfsDropdown(ufsDropdownArray);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    async function fetchData() {
      await axios
        .get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
        )
        .then((response) => {
          const cityNames = response.data.map((city) => city.nome);
          cityNames.sort(compare);
          const citiesDropdownArray = cityNames.map((city) => ({
            label: city,
            value: city,
          }));
          setCitiesDropdown(citiesDropdownArray);
        });
    }
    fetchData();
  }, [selectedUf]);

  return (
    <>
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: "Selecione uma UF", value: "0" }}
            value={selectedUf}
            onValueChange={(value) => {
              setSelectedUf(value);
            }}
            items={ufsDropdown}
          />
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: "Selecione uma Cidade", value: "0" }}
            value={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
            items={citiesDropdown}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" size={24} color="#FFF" />
              </Text>
            </View>
            <Text style={styles.buttonText}>Cadastre um ponto de coleta</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: "#c0c0c0",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: "black",
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 40,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: "black",
  },
});
