import * as React from 'react';
import { View, StyleSheet, KeyboardAvoidingView,  } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font';
import { Container, Form, Item, Picker, Text, Input, Button } from 'native-base';
import MyHeader from './src/components/Header'


const API = axios.create({
  baseURL: 'http://10.7.2.45:8080/api',
  headers: {
    Accept: 'application/json'
  },
})

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    barcode: '',
    local: {},
    locais: [],
    singlePickerVisibleLocais: false,
    status: '',
    reavaliacao: '',
    vistoriador: {},
    obs: '',
    singlePickerVisible: false,
    inventariantes: []
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font, ...MaterialIcons.font
    });
    this.getPermissionsAsync();

    API.get(`/inventariante`)
      .then((response) => {
        console.log(response.data)
        this.setState({ inventariantes: response.data, singlePickerVisible: true });

        API.get(`/local`)
          .then((response) => {
            console.log(response.data)
            this.setState({ locais: response.data });

          }).catch((error) => {
            console.log(error);

          })

      }).catch((error) => {
        console.log(error);

      })
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  SendData() {
    alert(`Os dados que serão enviados: 
      barcode ${this.state.barcode}\n
      Status ${this.state.status}\n
      reavaliacao: ${this.state.reavaliacao}\n
      Vistoriador: ${this.state.vistoriador.nome}\n
      Local: ${this.state.local.nome}\n
      Obs: ${this.state.obs}`);
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Premisão da camera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Sem Premisão da camera</Text>;
    }
    return (
      <Container style={{ flex: 1, }}>
        <MyHeader />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled>
          <View
            style={styles.component}>
            <View style={styles.component}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={{ ...StyleSheet.absoluteFillObject, ...styles.cameraContainer }}
              />
              {scanned && (
                <Button onPress={() => this.setState({ scanned: false, barcode: '' })} >
                  <Text>Ler outro Codigo</Text>
                </Button>
              )}
            </View>
            <View style={styles.contentArea}>
              <Form>
                <Item>
                  <Input placeholder="Aqui ficara o codigo de barras" value={this.state.barcode} editable={false} />
                </Item>

                <Item>
                  <Text>Status:</Text>
                  <Picker
                    style={{ width: undefined }}
                    placeholder="Select your SIM"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    placeholder="Selecione um status"
                    selectedValue={this.state.status}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ status: itemValue })
                    }>
                    <Picker.Item label="Localizado - LC" value="LC" />
                    <Picker.Item label="Não Localizado - NE" value="NE" />
                    <Picker.Item label="Sem placa - PS" value="SP" />
                    <Picker.Item label="Precisa de Reparo - PR" value="PR" />

                  </Picker>
                </Item>

                <Item>
                  <Text>Reavaliação: </Text>
                  <Picker
                    style={{ width: undefined }}
                    placeholder="Select your SIM"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    placeholder="Nescecita de reavaliação ?"
                    selectedValue={this.state.reavaliacao}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ reavaliacao: itemValue })
                    }>
                    <Picker.Item label="Sim" value="s" />
                    <Picker.Item label="Não" value="n" />

                  </Picker>
                </Item>
                <Item>
                  <Input placeholder='Observação' bordered value={this.state.obs} onChange={(e) => { this.setState({ obs: e.target.valueOf() }) }} />
                </Item>

                {/* <Button
                  title="Enviar"
                  onPress={() => this.SendData()}
                  
                /> */}
                <Button block onPress={() => this.SendData()} style={{marginStart:10}}>
                  <Text>Enviar</Text>
                </Button>
              </Form>
            </View>

          </View>

          <SinglePickerMaterialDialog
            title={'Qual o inventariante ?'}
            items={this.state.inventariantes.map((row, index) => ({ value: row, label: row.nome }))}
            visible={this.state.singlePickerVisible}
            onCancel={() => this.setState({ singlePickerVisible: false })}
            onOk={result => {
              this.setState({ singlePickerVisible: false, vistoriador: result.selectedItem.value, singlePickerVisibleLocais: true });
            }}
          />

          <SinglePickerMaterialDialog
            title={'Qual o Local ?'}
            items={this.state.locais.map((row, index) => ({ value: row, label: row.nome }))}
            visible={this.state.singlePickerVisibleLocais}
            onCancel={() => this.setState({ singlePickerVisibleLocais: false })}
            onOk={result => {
              this.setState({ singlePickerVisibleLocais: false, local: result.selectedItem.value });

            }}
          />
        </KeyboardAvoidingView>

      </Container>


    );
  }

  handleBarCodeScanned = ({ type, data }) => {

    this.setState({ scanned: true });
    this.setState({ barcode: data })
    API.get(`/inventario/${data}`)
      .then((response) => {
        console.log(response.data)

      }).catch((error) => {
        console.log(error);

      })

  };
}

const styles = StyleSheet.create({
  cameraContainer: {
    marginHorizontal: 0, marginLeft: 0, marginStart: 0,
    paddingHorizontal: 0, paddingLeft: 0, paddingStart: 0,
    height: '200%',
    padding: 0
  },
  boxes: {
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 15
  },
  itens: {
    flexDirection: 'row',
  },
  component: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  contentArea: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    marginEnd: 10
  }
});