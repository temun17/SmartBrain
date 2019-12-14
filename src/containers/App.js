import React from "react";
import Clarifai from "clarifai";
import Nav from "../components/Navigation/Nav";
import Logo from "../components/Logo/Logo";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import Particles from "react-particles-js";

import { connect } from "react-redux";
import { setInputURL } from "../actions/actions";

const app = new Clarifai.App({
  apiKey: "b2760f9e820044308efa89770ba07dab"
});

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 900
      }
    }
  }
};

const mapStateToProps = state => ({
  input: state.input
});

const mapDispatchToProps = dispatch => {
  return {
    onSearchChange: e => dispatch(setInputURL(e.target.value))
  };
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      imageURL: ""
    };
  }

  onButtonSubmit = () => {
    this.setState({
      imageURL: this.props.input
    });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.props.input).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info);
      },
      function(err) {}
    );
  };

  render() {
    const { onSearchChange } = this.props;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Nav />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={onSearchChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
