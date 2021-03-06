/* global google */
import React, { Component } from "react";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { connect } from "react-redux";
import cuid from "cuid";
import Script from "react-load-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { reduxForm, Field } from "redux-form";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import moment from "moment";

import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { createEvent, updateEvent } from "../eventActions";

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];

const validate = combineValidators({
  title: isRequired({ message: "Even Title Is Required" }),
  category: isRequired({ message: "Please Provide A Category" }),
  description: composeValidators(
    isRequired({ message: "Please Provide A Description" }),
    hasLengthGreaterThan(10)({
      message: "Description needs to be at least of 10 chars"
    })
  )(),
  city: isRequired({ message: "Please Provide A City" }),
  venue: isRequired({ message: "Venue Is Required" }),
  date: isRequired({ message: "Please Provide Date Of The Event" })
});

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleSubmit = values => {
    values.date = moment(values.data).format();
    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: "/assets/user.png",
        hostedBy: "Bob"
      };
      this.props.createEvent(newEvent);
      this.props.history.push("/events");
    }
  };

  render() {
    const { invalid, submitting, pristine } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDWeLWA6uBly5qRxcUpJIwWrlbeKGqnZJE&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
              <Field
                name="title"
                type="text"
                placeholder="Give Your Event A Name"
                component={TextInput}
              />
              <Field
                name="category"
                options={category}
                type="text"
                placeholder="What is your event about"
                component={SelectInput}
              />
              <Field
                name="description"
                type="text"
                placeholder="Tell us about your event"
                rows={3}
                component={TextArea}
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                options={{ types: ["(cities)"] }}
                type="text"
                placeholder="Event City"
                component={PlaceInput}
                onSelect={this.handleCitySelect}
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  placeholder="Event Venue"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ["establishment"]
                  }}
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="text"
                placeholder="Event Date And Time"
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                component={DateInput}
              />
              <Button
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
              <Button
                onClick={() => this.props.history.push("/events")}
                type="button"
              >
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const eventId = ownProps.match.params.id;
    let event = {};
    if (eventId && state.events.length > 0)
      event = state.events.filter(event => event.id === eventId)[0];
    return { initialValues: event };
  },
  {
    createEvent,
    updateEvent
  }
)(
  reduxForm({
    form: "reduxForm",
    enableReinitialize: true,
    validate
  })(EventForm)
);
