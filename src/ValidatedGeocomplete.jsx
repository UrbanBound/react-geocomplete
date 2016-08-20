import defaults from './defaults';
import propTypes from './prop-types';
import React from 'react';
import Geocomplete from './Geocomplete.jsx';

class ValidatedGeocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationState: this.getInitialValidationState(props.initialValue)
    };
  }

  componentWillMount() {
    var googleMaps = this.props.googleMaps ||
      (window.google && // eslint-disable-line no-extra-parens
        window.google.maps) ||
      this.googleMaps;

    /* istanbul ignore next */
    if (!googleMaps) {
      console.error(// eslint-disable-line no-console
        'Google map api was not found in the page.');
      return;
    }
    this.googleMaps = googleMaps;

    this.autocompleteService = new googleMaps.places.AutocompleteService();
    this.geocoder = new googleMaps.Geocoder();
  }

  getInitialValidationState(initialValue) {
    return initialValue ? 'initialInput' : 'empty';
  }

  componentDidMount() {
    if (this.props.validateInitial) {
      this.validateInitialInput();
    }
  }

  autocompleteOptions(userInput) {
    const options = {
      input: userInput
    };

    ['location', 'radius', 'bounds', 'types'].forEach(option => {
      if (this.props[option]) {
        options[option] = this.props[option];
      }
    });

    if (this.props.country) {
      options.componentRestrictions = {
        country: this.props.country
      };
    }
    return options;
  }

  // validateInitialInput() {
  //   const onSuccessfulGeocode = (result) => {
  //     if (this.props.initialInput === result) {
  //
  //     }
  //   }
  //   this.onInputGeocoded();
  // }

  inputMatchesAutocomplete(input, matches, doesNotMatch){
    const options = this.autocompleteOptions(input);
    this.autocompleteService.getPlacePredictions(
      options,
      suggestsGoogle => {

      });
  }

  onInputGeocoded(geocodeResult, success) {
    success(geocodeResult);
    this.props.onInputGeocoded(geocodeResult);
  }

  isValid() {
    return this.state.validationState === "valid";
  }
  render() {
    return <Geocomplete {...this.props}/>;
  }
}

/**
 * Types for the properties
 * @type {Object}
 */
ValidatedGeocomplete.propTypes = propTypes;

/**
 * Default values for the properties
 * @type {Object}
 */
ValidatedGeocomplete.defaultProps = defaults;

export default ValidatedGeocomplete;
