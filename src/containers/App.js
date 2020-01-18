import React from "react";
import Clarifai from "clarifai";
import Nav from "../components/Navigation/Nav";
import Logo from "../components/Logo/Logo";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";
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
      imageURL: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
    };
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById("inputImage");

    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({
      box
    });
  };

  onPictureSubmit = () => {
    this.setState({
      imageURL: this.props.input
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.props.input)
      .then(response => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log(error));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState({
        isSignedIn: false
      });
    } else if (route === "home") {
      this.setState({
        isSignedIn: true
      });
    }
    this.setState({
      route: route
    });
  };

  render() {
    const { onSearchChange } = this.props;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Nav
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={onSearchChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageURL={this.state.imageURL}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
