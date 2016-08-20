import filterInputAttributes from './filter-input-attributes';
import defaults from './defaults';
import propTypes from './prop-types';
import React from 'react';
import Geocomplete from './Geocomplete.jsx';
import some from 'lodash.some';

class ValidatedGeocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationState: 'initial'
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputMatchesAutocomplete = this.inputMatchesAutocomplete.bind(this);
    this.renderValidationErrors = this.renderValidationErrors.bind(this);
  }

  get value() {
    return this.refs.geocompleteBase.value;
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

  inputMatchesAutocomplete(userInput, matches, doesNotMatch) {
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

    this.autocompleteService.getPlacePredictions(
      options,
      suggestsGoogle => {
        if (some(suggestsGoogle, {description: userInput})) {
          matches();
        } else {
          doesNotMatch(userInput);
        }
      }
    );
  }

  isValid() {
    return this.state.validationState === "valid";
  }

  onChange(userInput) {
    this.setState({validationState: 'changing'}, () => this.props.onChange(userInput));
  }

  onBlur(value) {
    const onBlurAfterStateChange = () => this.props.onBlur(value),
      shouldValidateInputFound = Boolean(this.props.notFoundErrorComponent),
      shouldValidateRequired = Boolean(this.props.requiredErrorComponent);

    if (!Boolean(value) && shouldValidateRequired) {
      this.setState({validationState: 'invalidEmpty'}, onBlurAfterStateChange);
    } else if (shouldValidateInputFound) {
      const inputIsValid = () => this.setState({validationState: 'valid'}, onBlurAfterStateChange),
        inputIsNotValid = input => this.setState({validationState: 'invalidNotFound', notFoundCity: input}, onBlurAfterStateChange);
      this.inputMatchesAutocomplete(value, inputIsValid, inputIsNotValid);
    } else {
      this.props.onBlur(value);
    }
  }

  renderValidationErrors() {
    let ErrorComponent = null;
    switch (this.state.validationState) {
      case "invalidEmpty":
        ErrorComponent = this.props.requiredErrorComponent;
        return <ErrorComponent/>;
      case "invalidNotFound":
        ErrorComponent = this.props.notFoundErrorComponent;
        return <ErrorComponent userInput={this.state.notFoundCity}/>;
      default:
        return null;
    }
  }

  render() {
    const attributes = filterInputAttributes(this.props);
    return (
      <div>
        <Geocomplete ref="geocompleteBase" onChange={this.onChange} onBlur={this.onBlur} {...attributes}/>
        {this.renderValidationErrors()}
      </div>
    );
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
