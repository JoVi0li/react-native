import React from "react";
import { StatusBar, useWindowDimensions } from "react-native";


import LogoSvg from "../../assets/logo_background_gray.svg";
import DoneSvg from "../../assets/done.svg";

import {
  Container,
  Content,
  Title,
  Message,
  Footer,
} from "./style";
import { ConfirmButton } from "../../components/ConfirmButton";

export function SchedulingComplete({ navigation }) {
  const { width } = useWindowDimensions();

  function handleConfirmRental(){
    navigation.navigate("Home");
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoSvg width={width} />

      <Content>
        <DoneSvg height={80} width={80} />
        <Title>Carro alugado!</Title>

        <Message>
          Agora você só precisa ir {'\n'}
          até a concessionária da RENTX {'\n'}
          pegar o seu automóvel.
        </Message>
      </Content>

      <Footer>
        <ConfirmButton title="OK" onPress={handleConfirmRental} />
      </Footer>
    </Container>
  );
}