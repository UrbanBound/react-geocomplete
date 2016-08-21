import defaults from './defaults';
import propTypes from './prop-types';
import React from 'react';
import BaseGeocomplete from './BaseGeocomplete';
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
    this.validate = this.validate.bind(this);
    this.isValid = this.isValid.bind(this);
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
    if (Boolean(this.props.initialValue)) {
      this.validate(this.props.initialValue, () => {});
    }
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
    const isValidState = this.state.validationState === "valid",
      isNotRequiredAndEmpty = !Boolean(this.value) && !Boolean(this.props.requiredErrorComponent),
      checkValidationState = () => {
        this.validate(this.value, () => {});
        return false;
      };
    return isValidState || isNotRequiredAndEmpty || checkValidationState();
  }

  onChange(userInput) {
    this.setState({validationState: 'changing'}, () => this.props.onChange(userInput));
  }

  validate(userInput, afterValidate) {
    const shouldValidateInputFound = Boolean(this.props.notFoundErrorComponent),
      shouldValidateRequired = Boolean(this.props.requiredErrorComponent);
    if (!Boolean(userInput) && shouldValidateRequired) {
      this.setState({validationState: 'invalidEmpty'}, afterValidate);
    } else if (shouldValidateInputFound) {
      const inputIsValid = () => {
          this.setState({validationState: 'valid'}, afterValidate);
        },
        inputIsNotValid = invalidInput => {
          this.setState({validationState: 'invalidNotFound', notFoundCity: invalidInput}, afterValidate);
        };
      this.inputMatchesAutocomplete(userInput, inputIsValid, inputIsNotValid);
    } else {
      this.setState({validationState: 'valid'});
      afterValidate(userInput);
    }
  }

  onBlur(value) {
    const afterValidate = () => this.props.onBlur(value);
    this.validate(value, afterValidate);
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
    var {onChange, onBlur, ...otherProps} = this.props;
    return (
      <div>
        <BaseGeocomplete ref="geocompleteBase" onChange={this.onChange} onBlur={this.onBlur} {...otherProps}/>
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
