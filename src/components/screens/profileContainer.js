import React, { Component } from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux'; 

import Profile from './profile';
import PatientProfile from './patientUpdate'


export default class ProfileContainer extends Component {
  render() {
    return (
      <Router >
        <Stack hideNavBar={true}>
          <Scene key="Profile" component={Profile} nav={this.props} />
          <Scene key="PatientProfile" component={PatientProfile} />
        </Stack>
      </Router>
    );
  }
}