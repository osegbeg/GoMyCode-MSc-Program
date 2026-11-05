// src/App.js
import React, { Component } from 'react';
import { Container, Button, Card } from 'react-bootstrap';

class App extends Component {
  // 1. Initialize state with the Person object, boolean 'shows', and a timer counter
  state = {
    person: {
      fullName: "Lionel Messi",
      bio: "An Argentine professional footballer widely regarded as one of the greatest players of all time.",
      imgSrc: "https://media.gettyimages.com/id/955410340/photo/barcelona-spain-lionel-messi-of-barcelona-celebrates-after-scoring-his-sides-second-goal.jpg?s=612x612&w=0&k=20&c=HsNdAhpjTqJNK5tLFC1MjpN_xk7eCqSsaAbo_rVvH9Y=",
      profession: "Professional Footballer"
    },
    shows: false,
    elapsedTime: 0
  };

  // 2. Component Lifecycle: componentDidMount runs once when the component loads onto the screen
  componentDidMount() {
    // Start an interval that ticks every 1 second to track mounting time
    this.timerID = setInterval(() => {
      this.setState((prevState) => ({
        elapsedTime: prevState.elapsedTime + 1
      }));
    }, 1000);
  }

  // 3. Component Lifecycle: componentWillUnmount cleans up the timer to prevent memory leaks
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // 4. Method to toggle the boolean value of 'shows'
  toggleShow = () => {
    this.setState({ shows: !this.state.shows });
  };

  render() {
    // Destructure person properties for clean usage
    const { fullName, bio, imgSrc, profession } = this.state.person;

    return (
      <Container className="py-5 text-center">
        <h1 className="mb-3 fw-bold text-primary">State & Lifecycle Checkpoint</h1>
        
        {/* Timer Field Display */}
        <div className="mb-4 text-muted">
          <h5>
            Time since component mounted: <span className="text-dark fw-bold">{this.state.elapsedTime} seconds</span>
          </h5>
        </div>

        {/* Toggle Button */}
        <Button 
          variant={this.state.shows ? "danger" : "success"} 
          onClick={this.toggleShow} 
          className="mb-4 px-4 py-2 fw-bold shadow-sm"
        >
          {this.state.shows ? "Hide Profile" : "Show Profile"}
        </Button>

        {/* Conditional Rendering: Show profile card only if 'shows' is true */}
        {this.state.shows && (
          <div className="d-flex justify-content-center">
            <Card style={{ width: '22rem', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
              <Card.Img 
                variant="top" 
                src={imgSrc} 
                alt={fullName} 
                style={{ height: '260px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} 
              />
              <Card.Body className="text-center">
                <Card.Title className="fw-bold">{fullName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{profession}</Card.Subtitle>
                <Card.Text className="mt-3 text-secondary">{bio}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    );
  }
}

export default App;