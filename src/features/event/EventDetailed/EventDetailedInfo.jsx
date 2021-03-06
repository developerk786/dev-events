import React, { Component } from "react";
import { Segment, Grid, Icon, Button } from "semantic-ui-react";
import format from "date-fns/format";

import EventDetailedMap from "./EventDetailedMap";

class EventDetailedInfo extends Component {
  state = {
    mapShown: false
  };
  componentWillUnmount() {
    this.setState({
      mapShown: false
    })
  }
  showMapToggle = () => {
    this.setState(prevState => ({
      mapShown: !prevState.mapShown
    }));
  };
  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Column width={1}>
              <Icon size="large" color="teal" name="info" />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{event.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>
                {format(event.date, "dddd Do MMMM")} at{" "}
                {format(event.date, "h:mm A")}
              </span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{event.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.showMapToggle}
                color="teal"
                size="tiny"
                content={this.state.mapShown ? "Hide Map" : "Show Map"}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {this.state.mapShown && (
          <EventDetailedMap
            lat={event.venueLatLng.lat}
            lng={event.venueLatLng.lng}
          />
        )}
      </Segment.Group>
    );
  }
}

export default EventDetailedInfo;
