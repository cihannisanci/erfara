import React, { PropTypes } from "react";
import autoBind from "react-autobind";
import MessageList from "./MessageList";
import MessageBar from "./MessageBar";
import { orange700 } from "material-ui/styles/colors";

export default class MessagesWindow extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    conversation: PropTypes.object,
    onReadMessage: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { conversation } = nextProps;
    const messages = conversation && Object.keys(conversation.messages);
    const lastMessage = messages.slice(-1)[0];
    this.props.onReadMessage(lastMessage);
  }

  render() {
    const { style, conversation, onSendMessage } = this.props;
    const STYLE = {
      ...style,
      paddingLeft: "80px",
      paddingRight: "80px",
      paddingBottom: "10px",
      position: "relative",
    }
    if (!conversation) { return <div/>; }
    const messages = Object.values(conversation.messages);
    return <div style={ STYLE } className="messaging-pane">
      <img alt="background" className="background-image" />
      <MessageList messages={messages} style={{ width: "100%", position: "absolute", bottom: "150px", left: "0", top: "0" }} />
      <MessageBar style={{ height: "150px", width: "100%", backgroundColor: orange700, position: "absolute", bottom: "0", right: "0" }} onSend={onSendMessage}/>
    </div>
  }  
}