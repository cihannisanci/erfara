import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { darkBlack } from 'material-ui/styles/colors';
import autoBind from 'react-autobind';
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import store from "../../store/store";
import { addEvent } from "../../actions/eventActions";
import { getPhoto, uploadFile } from "../../utils/Api";

const PLACEHOLDER_PHOTO = "http://files.parsetfss.com/a5e80e30-a275-49f2-989e-e218e12017db/tfss-02ed6157-7aa6-4ffa-b530-16f711fb8f59-muir-woods.jpg";

function mapStateToProps(state) {
  return {
    userId: state.authedUser && state.authedUser.uid,
  };
}

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export class CreateEventModal extends React.Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    userId: PropTypes.string,
  };

  constructor() {
    super();
    autoBind(this);

    this.timestamp = new Date();
  }

  onError(error, type) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(type, " errorCode: ", errorCode, " errorMessage: ", errorMessage);
  }

  addNewEvent() {
    const { name, description, timestamp, locationString } = this;
    const { userId, onRequestClose } = this.props;
    const searchTerm = name.split(" ")[0];
    if (!this.props.userId) { return; }

    getPhoto(searchTerm)
    .then(blob => {
      return uploadFile(blob);
    })
    .then(url => {
      store.dispatch(addEvent(name, description, url, timestamp, locationString, userId));
      onRequestClose();
    })
    .catch(error => {
      store.dispatch(addEvent(name, description, PLACEHOLDER_PHOTO, timestamp, locationString, userId));
      onRequestClose();
    });
  }

  dateChange(placeholder, date) {
    this.timestamp.setFullYear(date.getFullYear());
    this.timestamp.setMonth(date.getMonth());
    this.timestamp.setDate(date.getDate());
  }

  timeChange(placeholder, date) {
    this.timestamp.setHours(date.getHours());
    this.timestamp.setMinutes(date.getMinutes());
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onRequestClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.addNewEvent}
      />,
    ];

    return (
        <Dialog
          actions={actions}
          contentStyle={{textAlign: "center", width: "60%", height: "500px"}}
          title={"Create Event"}
          titleStyle={{ fontSize: "1.1em", textAlign: "left", padding: "12px 0px 12px 25px", color: darkBlack }}
          modal={false}
          onRequestClose={this.props.onRequestClose}
          open={this.props.isOpen}>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <TextField
              hintText="Event Name"
              floatingLabelText="Event Name"
              onChange={(event, value) => { this.name = value; }}
            />
            <TextField
              hintText="Description"
              floatingLabelText="Description"
              onChange={(event, value) => { this.description = value; }}
            />
            <DatePicker hintText="Date" onChange={this.dateChange} />
            <TimePicker hintText="12hr Format" onChange={this.timeChange} />
            <TextField
              hintText="Location"
              floatingLabelText="Location"
              onChange={(event, value) => { this.locationString = value; }}
            />
          </div>
        </Dialog>
    );
  }
}

export default connect(mapStateToProps)(CreateEventModal);
