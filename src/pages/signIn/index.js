import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import api from '../../services/api';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  ButtonText,
  SignUpLink,
  SignUpLinkText
} from './styles';

export default class SignIn extends Component {
  // Oculta cabeçalho
  static navigationOptions = {
    header: null,
  };

  // Guardar variáveis
  state = { email: 'ederpbj@gmail.com', password: '123', error: '' };

  // Recupera o parametro e guarda na variável email do state
  handleEmailChange = (email) => {
    this.setState({ email });
  };

  // Guarda password
  handlePasswordChange = (password) => {
    this.setState({ password });
  };

  // Navega para tela cadastro
  handleCreateAccountPress = () => {
    this.props.navigation.navigate('SignUp');
  };

  // Comunicação com API para login
 handleSignInPress = async () => {
  //  Campos email e password obrigatórios
  if (this.state.email.length === 0 || this.state.password.length === 0) {
    this.setState(
      { error: 'Preencha usuário e senha para continuar!' },
      () => false
    );
  } else {
    try {
      const response = await api.post('/sessions', {
        email: this.state.email,
        password: this.state.password
      });

      /* Caso a requisição de autenticação tenha sido bem sucedida iremos guardar no Async Storage, que é uma API para armazenamento de dados offline do React Native, o token JWT retornado, pois usaremos ele em todas as requisições a partir de agora
       */
      await AsyncStorage.setItem('@AirBnbApp:token', response.data.token);

      /* Criar uma constante contendo as instruções para fazer o reset da Stack de navegação, isso para que quando a aplicação for redirecionada para a tela principal não tenha um botão de voltar para o Login; */
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Main',
          params: { token: response.data.token }
        })
      ]
    });

      /* E por último iremos usar um dispatch nessa constante contendo as instruções de reset. */
      this.props.navigation.dispatch(resetAction);
    } catch (_err) {
        this.setState({
          error: 'Houve um problema com o login, verifique suas credenciais!'
        });
      }
      
    }
    
  };

  // validação das props através do PropType
  /* Esse trecho indica que nesse componente é necessário 
  a passagem de um objeto navigation que contenha 
  as funções navigate e dispatch. */
static propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    dispatch: PropTypes.func,
  }).isRequired,
};


  render() {
    return (
      <Container>
        <StatusBar hidden />
        <Logo
          source={require('../../images/airbnb_logo.png')}
          resizeMode="contain"
        />
        <Input
          placeholder="Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {this.state.error.length !== 0 && (
          <ErrorMessage>{this.state.error}</ErrorMessage>
        )}
        <Button onPress={this.handleSignInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={this.handleCreateAccountPress}>
          <SignUpLinkText>Criar conta grátis</SignUpLinkText>
        </SignUpLink>
      </Container>
    );
  }
}
