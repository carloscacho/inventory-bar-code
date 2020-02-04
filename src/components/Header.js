import React, { Component } from 'react';
import {Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'

export default class MyHeader extends Component {
  render() {
    return (
        <Header style={{zIndex: 50, marginTop: 24}}>
          <Left>
            <Title>Inventory</Title>
          </Left>

          <Right>
            <Button transparent>
                <MaterialIcons style={{ fontSize: 24, color: '#eee'}} name='person' />
            </Button>
            <Button transparent>
              <MaterialIcons style={{ fontSize: 24, color: '#eee'}} name='place' />
            </Button>
          </Right>
        </Header>
    );
  }
}