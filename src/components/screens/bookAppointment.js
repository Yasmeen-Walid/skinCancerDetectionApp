import React from "react";
import DatePicker from "react-native-datepicker";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  TextInput, Alert
} from "react-native";
import { Button } from "galio-framework";
import Header from "../common/header";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TimePicker from "react-native-simple-time-picker";
import { Actions } from "react-native-router-flux";
class MyDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      time: "20:00",
      isDatePickerVisible: false,
      selectedHours: 0,
      selectedMinutes: 0,
      text: " ",
      dr_id: " ",
      patientId:" ",
      workingFrom:"",
      workingTo:"",
      workingHours:''
    };
    this.showDatePicker = this.showDatePicker.bind(this);
    this.hideDatePicker = this.hideDatePicker.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.book = this.book.bind(this);
  }

  async componentDidMount() {
    var that = this;
    try {
      const id = await AsyncStorage.getItem("Dr_id");
      const userId = await AsyncStorage.getItem("access_token");
      that.setState({ dr_id: JSON.parse(id),patientId:JSON.parse(userId)});


      const url = "http://192.168.127.67:8080/api/user/doctor"
      await axios
      .post(url, {id: JSON.parse(id)})
      .then( (res) => {
        let from = '';
        let to = '';

        if (res.data.workingTo[1] === ":" || res.data.workingTo[1] === " ") {
          to += res.data.workingTo[0]
        }
        else {
          to += res.data.workingTo[0] + res.data.workingTo[1]
        }
        if (res.data.workingFrom[1] === ":" || res.data.workingFrom[1] === " ") {
          from += res.data.workingFrom[0]
        }
        else {
          from += res.data.workingFrom[0] + res.data.workingFrom[1]
          to += res.data.workingTo[0] + res.data.workingTo[1]
        }

        that.setState({
          workingTo: to ,
          workingFrom: from,
          workingHours: res.data.workingFrom +" To " + res.data.workingTo
        })
      })
    } catch (e) {
      console.log(e)
      console.log("error !!");
    }
  }

  book = () => {
    console.log(this.state.workingTo)
   if (!(this.state.selectedHours >= Number(this.state.workingFrom) && this.state.selectedHours <= Number(this.state.workingTo)) ) {
      Alert.alert('Book Appointment', 'Unvalied time, this doctor is not working at this hours.\n\nWorking hour: '+ this.state.workingHours);
      return;
    }

    var url = `http://192.168.127.36:8080/bookappointment`;
    const appointment = {
      date: this.state.date,
      time: `${this.state.selectedHours} : ${this.state.selectedMinutes}`,
      discription: this.state.text,
      doctorId: this.state.dr_id,
      patientId: this.state.patientId,
    };
    
    axios
      .post(url, appointment)
      .then(function (response) {
        alert("Appointment booked! Wait the doctor response.");
        
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(appointment)
  };

  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    this.setState({
      time: date,
    });
    this.hideDatePicker();
  };

  render() {
    console.log(this.state)

    return (
      <View>
        
        
          <Text style={styles.descreption}>
            Choose a date and time to book your appointment.. 
           
          </Text>
          <Text>{"*Note: working hours from " + this.state.workingHours + "!" + "\n\n" }</Text>
        
        <View style={styles.container}>
          <Text style={styles.label}>Date</Text>
          <DatePicker
            style={{ width: 250, alignItems: "center" }}
            date={this.state.date}
            mode="date"
            placeholder="Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconSource={require("../../../assets/google_calendar.png")}
            onDateChange={(date) => {
              this.setState({ date: date });
            }}
          />

          <Text style={styles.label}>Time</Text>

          <View>
            {/* <Button title="Show Date Picker" onPress={this.showDatePicker} />
          <Text style={styles.label}>{this.state.time}</Text>
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="time"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          /> */}

            <Text style={styles.timeLabel}>
              {this.state.selectedHours}H:{this.state.selectedMinutes}M
            </Text>

            <TimePicker
              style={styles.time}
              selectedHours={this.state.selectedHours}
              selectedMinutes={this.state.selectedMinutes}
              onChange={(hours, minutes) =>{
               console.log(typeof hours )
                this.setState({
                  selectedHours: hours,
                  selectedMinutes: minutes,
                })}
              }
            />
          </View>
          <Text style={styles.label}>Note</Text>
          <TextInput
            placeholder="write a note for doctor"
            style={styles.note}
            width={260}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <Text>{"\n"}</Text>
          <Button style={styles.buttonStyle} onPress={this.book}>
            Book
          </Button>
        </View>
      </View>
    );
  }
}

export default MyDatePicker;
const styles = StyleSheet.create({
  container: {
    flex: -5,

    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  descreption: {
    textAlign: "center",
    margin: 0,
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: 30,
    fontSize: 25,
  },
  label: {
    fontSize: 25,
    textAlign: "center",
    color: "#18DCFF",
  },
  timeLabel: {
    fontSize: 25,
    textAlign: "center",
    color: "#000",
  },
  note: {
    borderColor: "#18DCFF",
    borderWidth: 3,
    textAlign: "center",
  },
  time: {
    borderColor: "#18DCFF",
    borderWidth: 3,
  },
  buttonStyle: {
    backgroundColor: "#18DCFF",
    borderWidth: 2,
    borderColor: "#18DCFF",
    borderRadius: 25,
  },
});
